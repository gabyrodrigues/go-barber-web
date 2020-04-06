import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default reducers => {
    const persistedReducer = persistReducer({
        key: 'gobarber', //garante que outra aplicação que não tiver essa mesma chave, não vai compartilhar estado
        storage,
        whitelist: ['auth', 'user'] //nome dos reducers que é preciso armazenar informações
    }, reducers);

    return persistedReducer;
}