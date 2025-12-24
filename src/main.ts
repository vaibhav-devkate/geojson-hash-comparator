import { generateStringHash, compareGeoJSON, GeoJSONComparison } from './hash.js';

interface FileInfo {
  name: string;
  size: number;
  content: string;
  hash?: string;
}

class GeoJSONComparator {
  private file1Input: HTMLInputElement;
  private file2Input: HTMLInputElement;
  private generateHashBtn: HTMLButtonElement;
  private compareFilesBtn: HTMLButtonElement;
  private resultDiv: HTMLElement;
  private comparisonDetailsDiv: HTMLElement;
  
  private file1Info: FileInfo | null = null;
  private file2Info: FileInfo | null = null;

  constructor() {
    this.file1Input = document.getElementById('file1') as HTMLInputElement;
    this.file2Input = document.getElementById('file2') as HTMLInputElement;
    this.generateHashBtn = document.getElementById('generateHash') as HTMLButtonElement;
    this.compareFilesBtn = document.getElementById('compareFiles') as HTMLButtonElement;
    this.resultDiv = document.getElementById('result') as HTMLElement;
    this.comparisonDetailsDiv = document.getElementById('comparison-details') as HTMLElement;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.file1Input.addEventListener('change', (e) => this.handleFileSelection(e, 1));
    this.file2Input.addEventListener('change', (e) => this.handleFileSelection(e, 2));
    this.generateHashBtn.addEventListener('click', () => this.generateHashes());
    this.compareFilesBtn.addEventListener('click', () => this.compareFiles());
  }

  private async handleFileSelection(event: Event, fileNumber: 1 | 2): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    const infoDiv = document.getElementById(`file${fileNumber}-info`) as HTMLElement;
    const hashDiv = document.getElementById(`file${fileNumber}-hash`) as HTMLElement;
    const errorDiv = document.getElementById(`file${fileNumber}-error`) as HTMLElement;

    // Hide error and show info
    errorDiv.style.display = 'none';
    infoDiv.style.display = 'block';
    
    try {
      // Validate file type
      if (!this.isValidGeoJSONFile(file)) {
        throw new Error('Please select a valid GeoJSON file (.geojson or .json)');
      }

      // Read file content
      const content = await this.readFileContent(file);
      
      // Validate JSON structure
      this.validateGeoJSON(content);

      const fileInfo: FileInfo = {
        name: file.name,
        size: file.size,
        content
      };

      if (fileNumber === 1) {
        this.file1Info = fileInfo;
      } else {
        this.file2Info = fileInfo;
      }

      // Update UI
      infoDiv.innerHTML = `
        <strong>📁 ${file.name}</strong><br>
        📊 Size: ${this.formatFileSize(file.size)}<br>
        ✅ Valid GeoJSON structure detected
      `;

      hashDiv.textContent = 'Hash will be generated...';
      
      // Enable buttons if we have at least one file
      this.updateButtonStates();

    } catch (error) {
      // Show error
      errorDiv.style.display = 'block';
      errorDiv.textContent = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      // Clear file info
      if (fileNumber === 1) {
        this.file1Info = null;
      } else {
        this.file2Info = null;
      }
      
      infoDiv.style.display = 'none';
      hashDiv.textContent = 'Hash will appear here...';
      
      this.updateButtonStates();
    }
  }

  private isValidGeoJSONFile(file: File): boolean {
    const validExtensions = ['.geojson', '.json'];
    return validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private validateGeoJSON(content: string): void {
    try {
      const json = JSON.parse(content);
      if (!json.type) {
        throw new Error('Invalid GeoJSON: missing "type" property');
      }
      
      const validTypes = ['FeatureCollection', 'Feature', 'Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'];
      if (!validTypes.includes(json.type)) {
        throw new Error(`Invalid GeoJSON: unsupported type "${json.type}"`);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format');
      }
      throw error;
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private updateButtonStates(): void {
    const hasFile1 = this.file1Info !== null;
    const hasFile2 = this.file2Info !== null;
    
    this.generateHashBtn.disabled = !hasFile1;
    this.compareFilesBtn.disabled = !(hasFile1 && hasFile2);
  }

  private async generateHashes(): Promise<void> {
    this.setButtonLoading(this.generateHashBtn, true);
    
    try {
      if (this.file1Info) {
        await this.generateHashForFile(this.file1Info, 1);
      }
      
      if (this.file2Info) {
        await this.generateHashForFile(this.file2Info, 2);
      }
      
      this.hideResult();
      
    } catch (error) {
      console.error('Error generating hashes:', error);
      this.showResult('Error generating hashes. Please try again.', 'neutral');
    } finally {
      this.setButtonLoading(this.generateHashBtn, false);
    }
  }

  private async generateHashForFile(fileInfo: FileInfo, fileNumber: 1 | 2): Promise<void> {
    const hashDiv = document.getElementById(`file${fileNumber}-hash`) as HTMLElement;
    
    try {
      hashDiv.innerHTML = '<span class="loading"></span>Generating hash...';
      
      const hash = await generateStringHash(fileInfo.content);
      fileInfo.hash = hash;
      
      hashDiv.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: 600; color: #495057;">SHA256 Hash:</div>
        <div style="color: #28a745; font-weight: 500;">${hash}</div>
      `;
      
    } catch (error) {
      hashDiv.innerHTML = `<span style="color: #dc3545;">❌ Error generating hash</span>`;
      throw error;
    }
  }

  private async compareFiles(): Promise<void> {
    if (!this.file1Info || !this.file2Info) return;
    
    this.setButtonLoading(this.compareFilesBtn, true);
    
    try {
      const comparison = await compareGeoJSON(this.file1Info.content, this.file2Info.content);
      this.displayComparison(comparison);
      
    } catch (error) {
      console.error('Error comparing files:', error);
      this.showResult('Error comparing files. Please try again.', 'neutral');
    } finally {
      this.setButtonLoading(this.compareFilesBtn, false);
    }
  }

  private displayComparison(comparison: GeoJSONComparison): void {
    // Show main result
    if (comparison.hashesMatch && comparison.contentMatch) {
      this.showResult('✅ Files are identical! Both content and hashes match perfectly.', 'same');
    } else if (comparison.hashesMatch) {
      this.showResult('✅ Hash values match, but there might be minor formatting differences.', 'same');
    } else {
      this.showResult('❌ Files are different! Hashes and/or content do not match.', 'different');
    }

    // Show detailed comparison
    this.comparisonDetailsDiv.style.display = 'block';
    this.comparisonDetailsDiv.innerHTML = `
      <h3 style="margin-bottom: 15px; color: #495057;">📊 Detailed Comparison</h3>
      
      <div class="comparison-item">
        <div class="comparison-label">Hash Comparison:</div>
        <div style="color: ${comparison.hashesMatch ? '#28a745' : '#dc3545'};">
          ${comparison.hashesMatch ? '✅ Hashes match' : '❌ Hashes differ'}
        </div>
      </div>

      <div class="comparison-item">
        <div class="comparison-label">Content Comparison:</div>
        <div style="color: ${comparison.contentMatch ? '#28a745' : '#dc3545'};">
          ${comparison.contentMatch ? '✅ Content identical' : '❌ Content differs'}
        </div>
      </div>

      <div class="comparison-item">
        <div class="comparison-label">File Sizes:</div>
        <div>
          File 1: ${this.formatFileSize(comparison.file1Size)}<br>
          File 2: ${this.formatFileSize(comparison.file2Size)}
          ${comparison.file1Size !== comparison.file2Size ? 
            ` <span style="color: #dc3545;">(Different sizes)</span>` : 
            ` <span style="color: #28a745;">(Same size)</span>`
          }
        </div>
      </div>

      <div class="comparison-item">
        <div class="comparison-label">Hash Values:</div>
        <div style="font-family: 'Courier New', monospace; font-size: 0.85rem; word-break: break-all;">
          <div style="margin-bottom: 8px;">
            <strong>File 1:</strong><br>
            <span style="color: #6c757d;">${comparison.file1Hash}</span>
          </div>
          <div>
            <strong>File 2:</strong><br>
            <span style="color: #6c757d;">${comparison.file2Hash}</span>
          </div>
        </div>
      </div>

      ${comparison.differences && comparison.differences.length > 0 ? `
        <div class="comparison-item">
          <div class="comparison-label">Detected Differences:</div>
          <ul style="margin: 8px 0; padding-left: 20px;">
            ${comparison.differences.map(diff => `<li style="color: #856404; margin-bottom: 4px;">${diff}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  }

  private setButtonLoading(button: HTMLButtonElement, loading: boolean): void {
    if (loading) {
      button.disabled = true;
      button.innerHTML = '<span class="loading"></span>Processing...';
    } else {
      button.disabled = false;
      if (button === this.generateHashBtn) {
        button.innerHTML = '🔒 Generate Hash(es)';
      } else if (button === this.compareFilesBtn) {
        button.innerHTML = '📊 Compare Files';
      }
      this.updateButtonStates();
    }
  }

  private showResult(message: string, type: 'same' | 'different' | 'neutral'): void {
    this.resultDiv.textContent = message;
    this.resultDiv.className = `result ${type}`;
    this.resultDiv.style.display = 'block';
  }

  private hideResult(): void {
    this.resultDiv.style.display = 'none';
    this.comparisonDetailsDiv.style.display = 'none';
  }
}

// Info Button Controller
class InfoButtonController {
  private infoToast: HTMLElement;
  private infoModal: HTMLElement;
  private closeModalBtn: HTMLElement;

  constructor() {
    this.infoToast = document.getElementById('infoToast') as HTMLElement;
    this.infoModal = document.getElementById('infoModal') as HTMLElement;
    this.closeModalBtn = document.getElementById('closeModal') as HTMLElement;

    this.setupEventListeners();
    this.startToastAnimation();
  }

  private setupEventListeners(): void {
    // Open modal when clicking the toast/button
    this.infoToast.addEventListener('click', () => this.openModal());

    // Close modal when clicking the close button
    this.closeModalBtn.addEventListener('click', () => this.closeModal());

    // Close modal when clicking outside the modal content
    this.infoModal.addEventListener('click', (e) => {
      if (e.target === this.infoModal) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.infoModal.classList.contains('show')) {
        this.closeModal();
      }
    });
  }

  private startToastAnimation(): void {
    // After 3.5 seconds (animation completes at 3s + 0.5s buffer), add button-mode class
    setTimeout(() => {
      this.infoToast.classList.add('button-mode');
    }, 3500);
  }

  private openModal(): void {
    this.infoModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  private closeModal(): void {
    this.infoModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GeoJSONComparator();
  new InfoButtonController();
});
