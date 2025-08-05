import * as signalR from '@microsoft/signalr';
import { userService } from '../userService';

const agencyHostAddress = 'https://dev-vnext-agency.opsinfra.net';

export const flightService = {
	createConnection: () =>
		new signalR.HubConnectionBuilder()
			.withUrl(`${agencyHostAddress}/hubs/fake-flight`, {
				accessTokenFactory: () => userService.getToken() ?? '',
				headers: {
					'X-Platform': 'Opsigo'
				}
			})
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build()
};
