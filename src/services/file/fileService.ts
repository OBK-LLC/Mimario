import { tokenStorage } from '../../utils/tokenStorage';

export interface FileResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  uploadedBy: string;
}

const BASE_URL = 'http://localhost:3000/api/v1';

export class FileService {
  private static async getHeaders() {
    const token = tokenStorage.getToken();
    if (!token) {
      throw new Error('Authorization token not found');
    }
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  static async uploadFiles(files: File[]): Promise<boolean> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const headers = await this.getHeaders();
      const response = await fetch(`${BASE_URL}/upload-documents`, {
        method: 'POST',
        headers: {
          ...headers
        },
        body: formData
      });

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      throw error;
    }
  }

  static async getDocuments(): Promise<FileResponse[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${BASE_URL}/documents`, {
        headers: {
          ...headers
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Dosyalar getirilemedi');
      }

      const data = await response.json();

      if (data?.success && data?.data) {
        return data.data.map((file: any) => ({
          id: file.id || '',
          name: file.file_name || file.name || '',
          size: file.file_size || file.size || 0,
          type: file.file_type || file.type || (file.file_name ? file.file_name.split('.').pop() : ''),
          uploadDate: file.created_at || file.uploadDate || new Date().toISOString(),
          uploadedBy: file.uploaded_by || file.uploadedBy || ''
        }));
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  static async updateDocument(documentId: string, content: string): Promise<FileResponse> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${BASE_URL}/update-document`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ documentId, content })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Dosya güncellenemedi');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteDocument(documentId: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${BASE_URL}/delete-document/${documentId}`, {
        method: 'DELETE',
        headers: {
          ...headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Dosya silme işlemi başarısız oldu';
        
        try {
          const data = JSON.parse(text);
          errorMessage = data.message || errorMessage;
        } catch (e) {
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw error;
    }
  }
}