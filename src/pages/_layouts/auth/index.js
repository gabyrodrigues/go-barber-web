import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, Content } from './styles';

export default function AuthLayout({ children }) { //passa tudo o que estiver dentro de <AuthLayout></AuthLayout>
    return (
        <Wrapper>
            <Content>
                {children}
            </Content>
        </Wrapper>
    );
}

AuthLayout.propTypes = {
    children: PropTypes.element.isRequired
};