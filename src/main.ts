import { MidiMessage } from 'midi';
import { createInputStream } from './midiListener';
import { decodeMidiStatusMessage } from './midiUtils';
import { ZoomHandler } from './zoomAdaptor/zoomHandler';

const config = require('config');

// Main application entry point
export function main() {
    try {
        const interestingChannel = config.targetOutputDeviceChannel - 1; // Convert to zero-based index
        const interestingInputDevices = config.targetInputDevices;
        const targetOutputDevice = config.targetOutputDevice;
        const changeControlMaps = config.changeControlMaps;

        // Initialize the Zoom handler
        
        const zoomHandler = new ZoomHandler(targetOutputDevice, changeControlMaps);

        // Start listening for MIDI messages
        createInputStream(interestingInputDevices, (rawMessage: MidiMessage) => {
            const decodedMessage = decodeMidiStatusMessage(rawMessage);
            console.log('Received message:', JSON.stringify(decodedMessage));

            // Only process messages on the specified channel
            if (decodedMessage.channel !== interestingChannel) return;

            // Pass the message to the Zoom handler
            zoomHandler.handleMessage(rawMessage);
        });
    } catch (error) {
        console.error('MIDI Router failed:', error);
        process.exit(1);
    }
}
