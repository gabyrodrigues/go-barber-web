import React, { useState, useMemo, useEffect } from 'react';
import { format, subDays, addDays, setHours, setMinutes, setSeconds, isBefore, isEqual, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';  //converte a data (new Date()) para tirar a timestamp
import pt from 'date-fns/locale/pt';
import { Container, Time } from './styles.js';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import api from '../../services/api';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; //é possivel marcar das 8h às 20h
 
export default function Dashboard() {
    const [schedule, setSchedule] = useState([]);
    const [date, setDate] = useState(new Date());
    
    const dateFormatted = useMemo(
        () => format(date, "d 'de' MMMM", { locale: pt }),
        [date]
    );

    useEffect(() => {
        async function loadSchedule() {
            const response = await api.get('schedule', {
                params: { date }
            });

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; //retorna a timezone do usuário

            const data = range.map(hour => {
                const checkDate = setSeconds(setMinutes(setHours(date, hour), 0), 0); //arredonda o horário
                const compareDate = utcToZonedTime(checkDate, timezone);

                return {
                    time: `${hour}:00h`,
                    past: isBefore(compareDate, new Date()), //todas as datas que forem anteriores ao horario atual vão ser diminuidas a opacidade
                    appointment: response.data.find(a =>
                        isEqual(parseISO(a.date), compareDate)
                    ) //se estiver preenchida, existe um agendamento nesse horário
                };
            });

            setSchedule(data);
        }

        loadSchedule();
    }, [date]);

    function handlePrevDay() {
        setDate(subDays(date, 1));
    }

    function handleNextDay() {
        setDate(addDays(date, 1));
    }

    return (
       <Container>
           <header>
               <button type="button" onClick={handlePrevDay}>
                    <MdChevronLeft size={36} color="#fff" />
               </button>
               <strong>{dateFormatted}</strong>
               <button type="button" onClick={handleNextDay}>
                    <MdChevronRight size={36} color="#fff" />
               </button>
           </header>

           <ul>
               {schedule.map(time => (
                    <Time key={time.time} past={time.past} available={!time.appointment}>
                        <strong>{time.time}</strong>
                        <span>{time.appointment ? time.appointment.user.name : 'Em aberto'}</span>
                    </Time>
               )) }
           </ul>
       </Container>
    );
}