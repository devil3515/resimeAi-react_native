import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ResumeState, Resume, ResumeTemplate, ResumeUploadForm } from '../types';

interface ResumeContextType extends ResumeState {
  uploadResume: (form: ResumeUploadForm) => Promise<void>;
  getResumes: () => Promise<void>;
  getResumeById: (id: string) => Promise<Resume | null>;
  updateResume: (resume: Resume) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  getTemplates: () => Promise<void>;
  setCurrentResume: (resume: Resume | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

type ResumeAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESUMES'; payload: Resume[] }
  | { type: 'SET_CURRENT_RESUME'; payload: Resume | null }
  | { type: 'SET_TEMPLATES'; payload: ResumeTemplate[] }
  | { type: 'ADD_RESUME'; payload: Resume }
  | { type: 'UPDATE_RESUME'; payload: Resume }
  | { type: 'DELETE_RESUME'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
  templates: [],
  isLoading: false,
  error: null,
};

const resumeReducer = (state: ResumeState, action: ResumeAction): ResumeState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_RESUMES':
      return { ...state, resumes: action.payload };
    case 'SET_CURRENT_RESUME':
      return { ...state, currentResume: action.payload };
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'ADD_RESUME':
      return { ...state, resumes: [...state.resumes, action.payload] };
    case 'UPDATE_RESUME':
      return {
        ...state,
        resumes: state.resumes.map(resume =>
          resume.id === action.payload.id ? action.payload : resume
        ),
        currentResume: state.currentResume?.id === action.payload.id ? action.payload : state.currentResume,
      };
    case 'DELETE_RESUME':
      return {
        ...state,
        resumes: state.resumes.filter(resume => resume.id !== action.payload),
        currentResume: state.currentResume?.id === action.payload ? null : state.currentResume,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  useEffect(() => {
    getTemplates();
  }, []);

  const uploadResume = async (form: ResumeUploadForm) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // TODO: Implement actual API call
      // const response = await resumeService.upload(form);
      
      // Mock response for now
      const mockResume: Resume = {
        id: Date.now().toString(),
        userId: '1',
        fileName: form.file.name || 'resume.pdf',
        fileUrl: 'mock_url',
        fileSize: form.file.size || 0,
        uploadDate: Date.now(),
        optimizationStatus: 'PENDING' as any,
        isFavorite: false,
      };
      
      dispatch({ type: 'ADD_RESUME', payload: mockResume });
      dispatch({ type: 'SET_CURRENT_RESUME', payload: mockResume });
    } catch (error) {
      console.error('Upload error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to upload resume' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getResumes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // TODO: Implement actual API call
      // const response = await resumeService.getResumes();
      
      // Mock response for now
      const mockResumes: Resume[] = [
        {
          id: '1',
          userId: '1',
          fileName: 'Software_Engineer_Resume.pdf',
          fileUrl: 'mock_url_1',
          fileSize: 1024000,
          uploadDate: Date.now() - 86400000,
          optimizationStatus: 'COMPLETED' as any,
          isFavorite: true,
        },
        {
          id: '2',
          userId: '1',
          fileName: 'Product_Manager_Resume.pdf',
          fileUrl: 'mock_url_2',
          fileSize: 2048000,
          uploadDate: Date.now() - 172800000,
          optimizationStatus: 'PENDING' as any,
          isFavorite: false,
        },
      ];
      
      dispatch({ type: 'SET_RESUMES', payload: mockResumes });
    } catch (error) {
      console.error('Get resumes error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch resumes' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getResumeById = async (id: string): Promise<Resume | null> => {
    try {
      const resume = state.resumes.find(r => r.id === id);
      if (resume) {
        dispatch({ type: 'SET_CURRENT_RESUME', payload: resume });
        return resume;
      }
      
      // TODO: Implement actual API call if not found locally
      // const response = await resumeService.getResumeById(id);
      return null;
    } catch (error) {
      console.error('Get resume by id error:', error);
      return null;
    }
  };

  const updateResume = async (resume: Resume) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // TODO: Implement actual API call
      // const response = await resumeService.updateResume(resume);
      
      dispatch({ type: 'UPDATE_RESUME', payload: resume });
    } catch (error) {
      console.error('Update resume error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update resume' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteResume = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // TODO: Implement actual API call
      // await resumeService.deleteResume(id);
      
      dispatch({ type: 'DELETE_RESUME', payload: id });
    } catch (error) {
      console.error('Delete resume error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete resume' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getTemplates = async () => {
    try {
      // TODO: Implement actual API call
      // const response = await resumeService.getTemplates();
      
      // Mock response for now
      const mockTemplates: ResumeTemplate[] = [
        {
          id: '1',
          name: 'Professional',
          description: 'Clean and professional template suitable for corporate roles',
          category: 'PROFESSIONAL' as any,
          previewImageUrl: 'mock_preview_1',
          isPremium: false,
          tags: ['corporate', 'professional', 'clean'],
        },
        {
          id: '2',
          name: 'Creative',
          description: 'Modern and creative template for design and creative roles',
          category: 'CREATIVE' as any,
          previewImageUrl: 'mock_preview_2',
          isPremium: true,
          tags: ['creative', 'modern', 'design'],
        },
        {
          id: '3',
          name: 'Executive',
          description: 'Sophisticated template for senior and executive positions',
          category: 'EXECUTIVE' as any,
          previewImageUrl: 'mock_preview_3',
          isPremium: true,
          tags: ['executive', 'senior', 'leadership'],
        },
      ];
      
      dispatch({ type: 'SET_TEMPLATES', payload: mockTemplates });
    } catch (error) {
      console.error('Get templates error:', error);
    }
  };

  const setCurrentResume = (resume: Resume | null) => {
    dispatch({ type: 'SET_CURRENT_RESUME', payload: resume });
  };

  const value: ResumeContextType = {
    ...state,
    uploadResume,
    getResumes,
    getResumeById,
    updateResume,
    deleteResume,
    getTemplates,
    setCurrentResume,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
