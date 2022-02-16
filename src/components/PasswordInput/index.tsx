import React, { useState } from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import { TextInputProps } from 'react-native';
import { Feather }from '@expo/vector-icons';
import { useTheme } from 'styled-components';

import {
    Container,
    IconContainer,
    InputText,
} from './styles';

interface Props extends TextInputProps {
    iconName: React.ComponentProps<typeof Feather>['name'];
    value?: string;
}

export function PasswordInput({
    iconName,
    value,
    ...rest
}: Props){
    const [isPasswordVisible, SetIsPasswordVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const theme = useTheme();

    function handlePasswordVisibilityChange(){
        SetIsPasswordVisible(prevState => !prevState);
    }

    function handleInputFocused(){
        setIsFocused(true);
    }

    function handleInputBlur(){
        setIsFocused(false);
        setIsFilled(!!value);
    }

    return(
        <Container>
            <IconContainer isFocused={isFocused}>
                <Feather 
                    name={iconName}
                    size={24}
                    color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
                />
            </IconContainer>
            <InputText 
                isFocused={isFocused}
                secureTextEntry={isPasswordVisible}
                onFocus={handleInputFocused}
                onBlur={handleInputBlur}
                autoCorrect={false}
                {...rest}
            />

            <BorderlessButton onPress={handlePasswordVisibilityChange}>
                <IconContainer>
                    <Feather 
                        name={ isPasswordVisible ? 'eye' : 'eye-off' }
                        size={24}
                        color={theme.colors.text_detail}
                    />
                </IconContainer>
            </BorderlessButton>
        </Container>
    )
}