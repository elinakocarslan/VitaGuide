const API_URL = 'http://localhost:5000';

export const mlService = {
    async trainModel(file: File): Promise<{ success: boolean; accuracy?: number; error?: string }> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/train`, {
                method: 'POST',
                body: formData,
            });
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Failed to train model' };
        }
    },

    async predict(inputData: { Entity: string }): Promise<{ success: boolean; prediction?: number; error?: string }> {
        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });
            return await response.json();
        } catch (error) {
            return { success: false, error: 'Failed to get prediction' };
        }
    },
}; 