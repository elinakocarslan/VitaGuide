// Simple localStorage wrapper for user data
export const UserStorage = {
  saveQuizResults: (results) => {
    try {
      localStorage.setItem('vitaguide_quiz_results', JSON.stringify(results));
    } catch (e) {
      console.error('Failed to save quiz results:', e);
    }
  },

  getQuizResults: () => {
    try {
      const data = localStorage.getItem('vitaguide_quiz_results');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get quiz results:', e);
      return null;
    }
  },

  clearQuizResults: () => {
    localStorage.removeItem('vitaguide_quiz_results');
  }
}; 