import { getContext, setContext } from 'svelte';

type Device = {
	isMobile: boolean;
};

const deviceKey = Symbol('device');

export function setDeviceContext(isMobile: Device) {
	setContext(deviceKey, isMobile);
}

export function getDeviceContext(): Device {
	return getContext(deviceKey) as Device;
}
