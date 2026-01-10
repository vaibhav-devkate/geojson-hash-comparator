// Browser-compatible hash functions using Web Crypto API
export const generateFileHash = async (buffer: ArrayBuffer): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return hash;
};

export const generateStringHash = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return hash;
};

export interface GeoJSONComparison {
  hashesMatch: boolean;
  contentMatch: boolean;
  file1Hash: string;
  file2Hash: string;
  file1Size: number;
  file2Size: number;
  differences?: string[];
}

export const compareGeoJSON = async (content1: string, content2: string): Promise<GeoJSONComparison> => {
  const hash1 = await generateStringHash(content1);
  const hash2 = await generateStringHash(content2);
  
  const hashesMatch = hash1 === hash2;
  const contentMatch = content1 === content2;
  
  const differences: string[] = [];
  
  if (!contentMatch) {
    try {
      const json1 = JSON.parse(content1);
      const json2 = JSON.parse(content2);
      
      if (json1.type !== json2.type) {
        differences.push(`Different types: ${json1.type} vs ${json2.type}`);
      }
      
      if (json1.features?.length !== json2.features?.length) {
        differences.push(`Different feature count: ${json1.features?.length || 0} vs ${json2.features?.length || 0}`);
      }
      
      if (JSON.stringify(json1) !== JSON.stringify(json2)) {
        differences.push('Content differs when parsed as JSON');
      }
    } catch (error) {
      differences.push('Unable to parse one or both files as JSON');
    }
  }
  
  return {
    hashesMatch,
    contentMatch,
    file1Hash: hash1,
    file2Hash: hash2,
    file1Size: content1.length,
    file2Size: content2.length,
    differences: differences.length > 0 ? differences : undefined
  };
};
