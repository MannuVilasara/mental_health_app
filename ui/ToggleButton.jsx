/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Colors } from './Colors';

type ToggleButtonProps = {
    isOn: boolean;
    onToggle: (value: boolean) => void;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOn, onToggle }) => {
    return (
        <TouchableOpacity
            onPress={() => onToggle(!isOn)}
            style={{
                width: 50,
                height: 25,
                borderRadius: 20,
                backgroundColor: isOn ? Colors.lightBlue : Colors.white,
                borderWidth: 1,
                borderColor: Colors.lightBlue,
                justifyContent: 'center',
                padding: 4,
            }}
        >
            <View
                style={{
                    height: '100%',
                    aspectRatio: 1,
                    borderRadius: 50,
                    backgroundColor: !isOn ? Colors.lightBlue : Colors.white,
                    alignSelf: isOn ? 'flex-end' : 'flex-start',
                }}
            />
        </TouchableOpacity>
    );
};

export default ToggleButton;
