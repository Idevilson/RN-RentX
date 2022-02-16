import React, { useEffect, useState }  from 'react';
import { StatusBar, Button } from 'react-native';
import { useNavigation }  from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import { database } from '../../database';
import { api } from '../../services/api';

import Logo from '../../assets/logo.svg';
import { CarDTO } from '../../dtos/CarDTO';

import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../database/models/Car';
import { LoadingAnimation } from '../../components/LoadingAnimation';

import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList,
} from './styles';

export function Home(){ 
   const [cars, setCars] = useState<ModelCar[]>([]);
   const [loading, setLoading] = useState(true);

   const netInfo = useNetInfo();
   const navigation = useNavigation();

   async function offilineSynchronize(){
      await synchronize({
         database,
         pullChanges: async ({ lastPulledAt }) => {
            const response = await api
            .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);

            const { changes, lastestVersion } = response.data;
            console.log(changes)
            return { changes, timestamp: lastestVersion };
         },
         pushChanges: async ({ changes }) => {
            console.log("APP PARA O PACKEND");
            const user = changes.users;
            await api.post('/users/sync', user);
         },
      });
   }

   useEffect(() => {
      let isMounted = true;

      async function fetchCars(){
         try {
            const carCollection = database.get<ModelCar>('cars');
            const cars = await carCollection.query().fetch();

            if(isMounted){
               setCars(cars);
            }

         } catch (error) {
            console.log(error);
         }finally{

            if(isMounted){
               setLoading(false);
            }

         }
      }

      fetchCars();
      return () => {
         isMounted = false;
      };
   }, []);

   useEffect(() => {
      if(netInfo.isConnected === true){
         offilineSynchronize
      }
   }, [netInfo.isConnected]);

   function handleCarDetails(car: CarDTO){
      navigation.navigate('CarDetails', { car });
   };

   return (
     <Container>
        <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
        />
         <Header>
            <HeaderContent>
               <Logo 
                  width={RFValue(108)}
                  height={RFValue(12)}
               />
               {
                  !loading && 
                  <TotalCars>
                     Total de {cars.length} Carros
                  </TotalCars>
               }
            </HeaderContent>
         </Header>

         <Button title="Sincronizar" onPress={offilineSynchronize}>Sinchronizar</Button>

         { loading ? <LoadingAnimation /> :
            <CarList 
               data={cars}
               keyExtractor={item => item.id}
               renderItem={({ item }) => 
                  <Car data={item} onPress={() => handleCarDetails(item)}/>
               }
            />
         }

     </Container>
   );
}
