import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAccessToken } from '../utils/localStorageService';
import { useAuth } from '../contexts/AuthContext';
import { Typography } from '@mui/material';
import { useState } from 'react';
import Notification from './Notification';
import { FormattedMessage } from 'react-intl';

export default function WebSocketNotification ({ onUpdate }) {

  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('Desativada.');
  const [messageNotification, setMessageNotification] = useState(null);
  const [typeNotification, setTypeNotification] = useState(null);

  const onMessageReceived = (payload) => {
    const payloadObject = JSON.parse(payload.body);
    const url = payloadObject.url;
    const typeNotification = (payloadObject.status == 'ERRO' ? "warning" : "success");
    const messageNotification = (typeNotification == "warning")
                                        ? <FormattedMessage id="webSocket.warning"
                                                            defaultMessage="Houve um erro com o processo."
                                                            values={{url: url}}/>
                                        :  <FormattedMessage id="webSocket.success"
                                                            defaultMessage="O processo está pronto."
                                                            values={{url: url}}/>;
    setTypeNotification(typeNotification);
    setMessageNotification(messageNotification);
    onUpdate();
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      console.log("Não há token.");
      return;
    }
    
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:7777/api/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000, // Quando conexão cai, tenta reconexão após 5s
      heartbeatIncoming: 4000, // Recebe ping do servidor a cada 4s
      heartbeatOutgoing: 4000, // Envia ping ao servidor a cada 4s
    });

    // Executa quando recebe STOMP frame CONNECTED
    client.onConnect = (frame) => {
      console.log('Conectado:', frame);
      setConnectionStatus(<FormattedMessage id="webSocket.connectionActive"
                                            defaultMessage="Ativa" />);
      client.subscribe('/user/queue/updates', onMessageReceived); // Envia STOMP SUBSCRIBE
    };

    client.onStompError = (frame) => {
      console.error('Erro: ' + frame.headers['message'] + frame.body);
      setConnectionStatus(<FormattedMessage id="webSocket.connectionInactive"
                                            defaultMessage="Desativada" />)
    };

    // Envia handshake para endpoint e manda STOMP CONNECT com connectHeaders
    client.activate();

    return () => {
      if (client) {
        console.log("Desconectando...");
        client.deactivate();
      }
    };
  }, [user]);

  return (
    <>
      <Typography variant='h7'>
        <FormattedMessage id="webSocket.connection" defaultMessage={"Conexão: " + connectionStatus}
                          values={{status:connectionStatus}} />
      </Typography>
      <Notification messageNotification={messageNotification} 
                    typeNotification={typeNotification} duration={15000} />
    </>
  );
};