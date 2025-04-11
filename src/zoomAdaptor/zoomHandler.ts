import { decorateSysexMessage } from '../midiUtils';
import * as midi from 'midi';
import { ZoomTransformer } from './zoomTransformer';
import { ChangeControlMap, MidiStatusMessage } from '../../types/midiMessages.spec';

export class ZoomHandler {
    private readonly output: midi.Output;
    private readonly transformer: ZoomTransformer;

    constructor(
        private readonly targetDeviceName: string,
        changeControlMaps: ChangeControlMap[]
    ) {
        this.output = new midi.Output();
        this.output.closePort();
        this.initializeOutputStream();

        // Initialize the ZoomTransformer with the provided changeControlMaps and queryZoomState function
        this.transformer = new ZoomTransformer(changeControlMaps, this.queryZoomState.bind(this));
    }

    // Initialize the output stream by finding and opening the correct port
    private initializeOutputStream(): void {
        console.log(`Registering Zoom device (${this.targetDeviceName})...`);
        const numPorts = this.output.getPortCount();
        console.log(`Found ${numPorts} MIDI output ports`);

        for (let i = 0; i < numPorts; i++) {
            const portName: string = this.output.getPortName(i);
            console.log(`Port ${i}: ${portName}`);
            if (portName.startsWith(this.targetDeviceName)) {
                console.log(`...found interesting device`);
                console.log(`Sending on port ${i} to device ${portName}`);
                this.openPortOnDevice(i);
                return;
            }
        }

        console.error(`No interesting output device found`);
        throw new Error(`No interesting output device found`);
    }

    // Open the port and send the initial edit mode message
    private openPortOnDevice(port: number): void {
        this.output.openPort(port);

        const editModeMessage = decorateSysexMessage([0x52, 0x00, 0x58, 0x50]);
        console.log(`Sending edit mode message: ${editModeMessage}`);
        this.output.sendMessage(editModeMessage);
    }

    // Handle incoming messages, transform them, and send them to the Zoom device
    public handleMessage(message: MidiStatusMessage): void {
        console.log(`Handling message for Zoom device: ${message}`);
        
        // Use the ZoomTransformer to transform the incoming message
        const transformedMessage = this.transformer.transformMessage(message);

        // Send the transformed message to the Zoom device
        this.output.sendMessage(transformedMessage);
    }

    // Query the Zoom device's state
    public queryZoomState(): Promise<any> {
        console.log('Querying Zoom device state...');
        // Placeholder for actual query logic
        return Promise.resolve({}); // Replace with actual state query logic
    }
}