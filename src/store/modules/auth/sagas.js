import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '../../../services/history';
import api from '../../../services/api';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }){
    try {
        const { email, password } = payload;

        const response = yield call(api.post, 'sessions', {
            email,
            password
        });

        const { token, user } = response.data;

        if(!user.provider) { //se o usuário não for um prestador de serviço ele não pode logar
            toast.error('Usuário não é prestador.');
            return;
        }

        api.defaults.headers.Authorization = `Bearer ${token}`;

        yield put(signInSuccess(token, user));

        history.push('/dashboard');
    } catch(err) {
        toast.error('Falha na autenticação. Verifique seus dados e tente novamente');
        yield put(signFailure());
    }
}

export function* signUp({ payload }) {
    try {
        const { name, email, password } = payload;
        
        yield call(api.post, 'users', {
            name,
            email,
            password,
            provider: true
        });

        history.push('/'); //depois do cadastro é redirecionado à tela de login
    } catch (err) {
        toast.error('Falha do cadastro. Verifique seus dados e tente novamente');

        yield put(signFailure());
    }
}

export function setToken({ payload }) {
    //se for a primeira vez que o usuário estiver acessando a aplicação
    if(!payload) {
        return; 
    }

    const { token } = payload.auth;

    if(token) { //token sempre presente quando o usuário estiver logado, então toda chamada api envia o token de autenticação junto com a chamada
        api.defaults.headers.Authorization = `Bearer ${token}`;
    }
}

export default all([
    takeLatest('persist/REHYDRATE', setToken),
    takeLatest('@auth/SIGN_IN_REQUEST', signIn),
    takeLatest('@auth/SIGN_UP_REQUEST', signUp)
]);