import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { tokenService } from '@/lib/token';
import { jwtDecode } from 'jwt-decode';
import { LoginSchema, type LoginFormData } from '@/schemas/authSchema';
import type { UserInfoToken } from '@/types/auth';
import { handleApiError } from '@/lib/utils';
import { TENANT_CODE } from '@/constants/common';
import { ROUTES } from '@/router/routes.config';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const state = location.state as { message?: string; type?: 'error' | 'success' } | null;
    if (state?.message) {
      if (state.type === 'success') {
        toast.success(t(state.message));
      } else {
        toast.error(t(state.message));
      }
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Map form data to API format
      const loginData = {
        username: data.username,
        password: data.password,
        tenantCode: TENANT_CODE,
      };
      const res = await authService.login(loginData);
      const { accessToken, refreshToken, tokenId } = res;

      if (accessToken) {
        const userInfoToken = jwtDecode<UserInfoToken>(accessToken);
        tokenService.setTokens(accessToken, refreshToken, tokenId, JSON.stringify(userInfoToken));

        toast.success(t('login.loginSuccess'));
        navigate('/');
      } else {
        throw new Error('No access token received');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      handleApiError(error, undefined, t('login.loginError'));
    }
  };
  if (tokenService.getAccessToken()) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  return (
    <div className='w-full max-w-md'>
      <div className='bg-white rounded-lg shadow-sm p-8'>
        <h1 className='text-xl font-semibold text-center mb-6'>{t('login.title')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Input
              type='text'
              placeholder={t('login.emailPlaceholder')}
              {...register('username')}
              aria-invalid={!!errors.username}
              className='w-full h-10'
            />
            {errors.username && (
              <p className='text-sm text-destructive'>{errors.username.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('login.passwordPlaceholder')}
                {...register('password')}
                aria-invalid={!!errors.password}
                className='w-full pr-10 h-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className='text-sm text-destructive'>{errors.password.message}</p>
            )}
          </div>

          <Button type='submit' disabled={isSubmitting} className='w-full bg-primary bg-primary/90'>
            {isSubmitting ? 'Đang đăng nhập...' : t('login.loginButton')}
          </Button>

          {/* <div className='text-right'>
            <a href='#' className='text-sm text-primary hover:underline'>
              {t('login.forgotPassword')}
            </a>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
