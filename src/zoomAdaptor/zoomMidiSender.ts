import { decorateSysexMessage } from '../midiUtils';
import * as midi from 'midi';

const output = new midi.Output();
output.closePort();

export function createOutputStream(targetDeviceName: string): midi.Output {

    console.log(`Registering Zoom device (${targetDeviceName})...`)
    const numPorts = output.getPortCount();
    console.log(`Found ${numPorts} MIDI output ports`);

    for (let i = 0; i < numPorts; i++) {
        const portName: string = output.getPortName(i);
        console.log(`Port ${i}: ${portName}`);
        if (portName.startsWith(targetDeviceName)) {

            console.log(`...found interesting device`);
            console.log(`Sending on port ${i} to device ${portName}`);
            openPortOnDevice(i)
            return output
            
        }
    }

    console.error(`No interesting output device found`);

    throw new Error(`No interesting output device found`);
}

function openPortOnDevice (port: number) {

    output.openPort(port);

    // Send the editing message so Zoom is set to receive
    //const identifierMessage = decorateSysexMessage([0x7E, 0x00, 0x06, 0x01])
    const editModeMessage = decorateSysexMessage([0x52, 0x00, 0x58, 0x50])
    console.log(`Sending edit mode message: ${editModeMessage}`)
    output.sendMessage(editModeMessage);

}