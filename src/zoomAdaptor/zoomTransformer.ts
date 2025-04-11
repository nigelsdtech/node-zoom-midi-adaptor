import { DecodedMidiMessage, MidiMessageType, MidiStatusMessage, ChangeControlMap } from '../../types/midiMessages.spec';
import { decodeMidiStatusMessage, decorateSysexMessage } from '../midiUtils';

export class ZoomTransformer {
    private readonly changeControlMaps: ChangeControlMap[];
    private readonly queryZoomState: () => Promise<any>;

    constructor(
        changeControlMaps: ChangeControlMap[],
        queryZoomState: () => Promise<any>
    ) {
        this.changeControlMaps = changeControlMaps;
        this.queryZoomState = queryZoomState;
    }

    public transformMessage(rawMessage: MidiStatusMessage): MidiStatusMessage {
        const decodedMidiStatusMessage: DecodedMidiMessage = decodeMidiStatusMessage(rawMessage);
        const { messageType, data0 } = decodedMidiStatusMessage;

        if (messageType !== MidiMessageType.ControlChange) return rawMessage;

        // Get the relevant map
        const relevantMap = this.changeControlMaps.find((map) => map.ccNum === data0);

        // Just pass back the message if a map isn't found
        if (!relevantMap) return rawMessage;

        const { data1: paramValue } = decodedMidiStatusMessage;

        switch (relevantMap.action) {
            case 'changeEffectParam':
                return this.createChangeEffectParamMessage(
                    relevantMap.effectPosition,
                    relevantMap.paramNum,
                    paramValue
                );
            case 'effectOnOff':
                return this.createChangeEffectParamMessage(
                    relevantMap.effectPosition,
                    0x00,
                    paramValue <= 64 ? 0x00 : 0x01
                );
            case 'tunerOnOff':
                // Directly handle tunerOnOff
                return [0xB0, 0x4A, paramValue];
            default:
                return rawMessage;
        }
    }

    private createChangeEffectParamMessage(
        effectNum: number,
        paramNum: number,
        paramValue: number
    ): MidiStatusMessage {
        return decorateSysexMessage([
            0x52,
            0x00,
            0x58,
            0x31,
            effectNum,
            paramNum,
            paramValue,
            0x00,
        ]);
    }
}