import * as midi from 'midi';
import { MidiMessage } from 'midi';


const input = new midi.Input();
input.closePort();

function registerConnectedMidiDevices(interestingDeviceNames: string[] = []): void {

    console.log('Registering input devices...')
    const numPorts = input.getPortCount();
    console.log(`Found ${numPorts} MIDI ports`);

    for (let i = 0; i < numPorts; i++) {
        const portName = input.getPortName(i);
        console.log(`Port ${i}: ${portName}`);
    }

    const finalPort = getPortNumberForAvailableInterestingDevice(
        interestingDeviceNames[0],
        interestingDeviceNames.slice(1),
        numPorts
    );

    console.log(`Listening on port ${finalPort} for device ${input.getPortName(finalPort)}`);
    input.openPort(finalPort);

}


function getPortNumberForAvailableInterestingDevice(
    currentInterestingDeviceName: string,
    remainingInterestingDeviceNames: string[],
    numPorts: number
): number {

    for (let i = 0; i < numPorts; i++) {
        const portName: string = input.getPortName(i);
        if (portName.startsWith(currentInterestingDeviceName)) {
            return i;
        }
    }

    if (remainingInterestingDeviceNames.length === 0) {
        console.error('No interesting devices found');
        throw new Error('No interesting devices found');
    }

    return getPortNumberForAvailableInterestingDevice(remainingInterestingDeviceNames[0], remainingInterestingDeviceNames.slice(1), numPorts);

}


export function createInputStream(
    interestingDeviceNames: string[],
    callback: (rawMessage: MidiMessage) => void
): void {

    registerConnectedMidiDevices(interestingDeviceNames);

    input.on('message', (_, message) => {
        // The message is an array of numbers corresponding to the MIDI bytes:
        //   [status, data1, data2]
        // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
        // information interpreting the messages.
        callback(message)
    });
}