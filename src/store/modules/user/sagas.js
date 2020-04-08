import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';

import { updateProfileSuccess, updateProfileFailure } from './actions';

export function* updateProfile({ payload }) {
    try {
        const { name, email, avatar_id, ...rest } = payload.data;
        
        const profile = Object.assign(
            { name, email, avatar_id },
            rest.oldPassword ? rest : {} //se tiver algo dentro de oldPassword aí sim ele inclui as informações junto com o payload (...rest)
        );

        const response = yield call(api.put, 'users', profile); //pega automaticamente o usuário logado

        toast.success('Perfil atualizado com successo!');

        yield put(updateProfileSuccess(response.data));
    } catch(err) {
        toast.error('Erro ao atualizar perfil. Confira seus dados.');

        yield put(updateProfileFailure());
    }
}

export default all([
    takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)
]);