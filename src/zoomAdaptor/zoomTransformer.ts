import { DecodedMidiMessage, MidiMessageType, MidiStatusMessage, ChangeControlMap } from '../../types/midiMessages.spec';
import { decodeMidiStatusMessage, decorateSysexMessage } from '../midiUtils';

export function transformMessage (
    rawMessage: MidiStatusMessage,
    changeControlMaps: ChangeControlMap[]
): MidiStatusMessage {
    const decodedMidiStatusMessage: DecodedMidiMessage = decodeMidiStatusMessage(rawMessage);
    const { messageType, data0 } = decodedMidiStatusMessage;

    if (messageType !== MidiMessageType.ControlChange) return rawMessage;

    // Get the relevant map
    const relevantMap = changeControlMaps.find((map) => map.ccNum === data0);

    // Just pass back the message if a map isn't found
    if (!relevantMap) return rawMessage;

    const { data1: paramValue } = decodedMidiStatusMessage;

    switch (relevantMap.action) {
        case 'changeEffectParam':
            return createChangeEffectParamMessage(
                relevantMap.effectPosition,
                relevantMap.paramNum,
                paramValue
            );
        case 'effectOnOff':
            return createChangeEffectParamMessage(
                relevantMap.effectPosition,
                0x00,
                paramValue <= 64 ? 0x00 : 0x01
            );
        case 'tunerOnOff':
            // Directly handle tunerOnOff without memoization
            return [0xB0, 0x4A, paramValue];
        default:
            return rawMessage;
    }
};

function createChangeEffectParamMessage(
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