import React, { useState } from 'react';
import { StatusBar, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { BackButton } from '../../components/BackButton';
import ArrowSvg from '../../assets/arrow.svg';

import { format } from 'date-fns/esm';
import { getPlataformDate } from '../../utils/getPlataformDate';
import { CarDTO } from '../../dtos/CarDTO';

import { 
    Container,
    Header,
    Title,
    RentalPeriod,
    DateInfo,
    DateTitle,
    DateValue,
    Content,
    Footer
} from './styles';

import { Button } from '../../components/Button';
import { 
    Calendar, 
    DayProps, 
    generateInterval,
    MarkedDateProps 
} from '../../components/Calendar';

interface RentalPeriod {
    startFormatted: string;
    endFormatted: string;
}

interface Params {
    car: CarDTO
  }
  
export function Scheduling() {
    const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps)
    const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)

    const theme = useTheme();
    const navigation = useNavigation();

    const route = useRoute();
    const { car } = route.params as Params;

    function handleConfirmRental(){
        if(!rentalPeriod.startFormatted || !rentalPeriod.endFormatted){
            Alert.alert("Selecione o intervalo para alugar.");
        }else{
            navigation.navigate('SchedulingDetails', {
                car,
                dates: Object.keys(markedDates)
            })
        }
    }

    function handleBack(){
        navigation.goBack();
    }

    function handleChangeDate(date: DayProps){
        let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
        let end = date;

        if(start.timestamp > end.timestamp){
            start = end;
            end = start;
        }

        setLastSelectedDate(end);
        const intervalo = generateInterval(start, end);
        setMarkedDates(intervalo);

        const firstDate = Object.keys(intervalo)[0];
        const endDate = Object.keys(intervalo)[Object.keys(intervalo).length -1];

        setRentalPeriod({
            startFormatted: format(getPlataformDate(new Date(firstDate)), 'dd/MM/yyyy'),
            endFormatted: format(getPlataformDate(new Date(endDate)), 'dd/MM/yyyy'),
        })
    }
    return(
        <Container>
            <Header>
              <StatusBar 
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
              />
                <BackButton 
                    onPress={handleBack} 
                    color={theme.colors.shape}
                />

                <Title>
                    Escolha uma {'\n'}
                    data de inicio e
                    fim do alugel
                </Title>

                <RentalPeriod>
                    <DateInfo>
                        <DateTitle>De</DateTitle>
                        <DateValue selected={!!rentalPeriod.startFormatted}>
                            {rentalPeriod.startFormatted}
                        </DateValue>
                    </DateInfo>

                    <ArrowSvg />

                    <DateInfo>
                        <DateTitle>De</DateTitle>
                        <DateValue selected={!!rentalPeriod.startFormatted}>
                            {rentalPeriod.endFormatted}
                        </DateValue>
                    </DateInfo>
                </RentalPeriod>
            </Header>

            <Content>
                <Calendar 
                    markedDates={markedDates}
                    onDayPress={handleChangeDate}
                />
            </Content>

            <Footer>
                <Button 
                    title="Confirmar" 
                    onPress={handleConfirmRental}
                    enabled={!!rentalPeriod.startFormatted}
                />
            </Footer>
        </Container>
    )    
}