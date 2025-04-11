import { MidiMessage } from 'midi'
import {createInputStream} from './midiListener'
import {decodeMidiStatusMessage} from './midiUtils'
import { transformMessage } from './zoomAdaptor/zoomTransformer'
import { createOutputStream } from './zoomAdaptor/zoomMidiSender'
import { DecodedMidiMessage, MidiStatusMessage } from '../types/midiMessages.spec'
import * as midi from 'midi';

const config = require('config');


// Main application entry point
export function main() {


  try {


    const interestingChannel = (config.targetOutputDeviceChannel - 1) // Changing from human-readable to off-by-one (ugh)
    const interestingInputDevices = config.targetInputDevices
    const targetOutputDevice = config.targetOutputDevice
    const changeControlMaps = config.changeControlMaps
    

    // Register midi destination
    const outputStream : midi.Output = createOutputStream(targetOutputDevice)

    // Start listening
    createInputStream(interestingInputDevices, (rawMessage: MidiMessage) => {


      const decodedMessage : DecodedMidiMessage = decodeMidiStatusMessage(rawMessage)
      const decodedMessageString = JSON.stringify(decodedMessage)
      console.log('Received message:', decodedMessageString)

      // Only look for messages on the specified channel
      if (decodedMessage.channel != interestingChannel) return
      
      // Transform message
      const transformedMessage : MidiStatusMessage = transformMessage(rawMessage, changeControlMaps)

      // Send message on to the destination
      console.log(`Sending ${transformedMessage}`)
      console.log(`In hex: ${transformedMessage.map(v => v.toString(16).toUpperCase())}`)
      outputStream.sendMessage(transformedMessage)
      console.log('=====================')
    })

  } catch (error) {
    console.error('MIDI Router failed:', error);
    process.exit(1);
  }
}
