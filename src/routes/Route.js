import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import AuthLayout from '../pages/_layouts/auth';
import DefaultLayout from '../pages/_layouts/default';

import store from '../store/';

export default function RouteWrapper({
    component: Component, //component(atributo component da rota): Component(componente passado como parametro)
    isPrivate, //utilizado em rotas em que só é possível acessar se o usuário estiver logado
    ...rest //todos as outras propriedades são colocadas aqui
}) {
    const { signed } = store.getState().auth; //o padrão é não logado (false)

    if(!signed && isPrivate) {
        return <Redirect to="/" />
    }

    if(signed && !isPrivate) {
        return <Redirect to="/dashboard" />
    }

    const Layout = signed ? DefaultLayout : AuthLayout; //troca de layout dependendo de estar online ou não

    return ( 
        <Route 
         {...rest} 
         render={props => (
            <Layout>
               <Component {...props} />
            </Layout>
            )} 
        />
    );
}

RouteWrapper.propTypes = {
    isPrivate: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired //não pode iniciar uma rota sem ter um componente nela
};

RouteWrapper.defaultProps = {
    isPrivate: false
};