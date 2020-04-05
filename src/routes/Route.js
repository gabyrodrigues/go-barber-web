import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export default function RouteWrapper({
    component: Component, //component(atributo component da rota): Component(componente passado como parametro)
    isPrivate, //utilizado em rotas em que só é possível acessar se o usuário estiver logado
    ...rest //todos as outras propriedades são colocadas aqui
}) {
    const signed = false; //o padrão é não logado

    if(!signed && isPrivate) {
        return <Redirect to="/" />
    }

    if(signed && !isPrivate) {
        return <Redirect to="/dashboard" />
    }

    return <Route {...rest} component={Component} />
}

RouteWrapper.propTypes = {
    isPrivate: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired //não pode iniciar uma rota sem ter um componente nela
};

RouteWrapper.defaultProps = {
    isPrivate: false
};