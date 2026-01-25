import React, {Pressable, Text} from 'react-native';

export default function AppButton({title, 
    onPress, 
    disabled
}: {title: string; 
    onPress: () => void; 
    disabled?: boolean}) {
  return (
    <Pressable 
    onPress={onPress} 
    disabled={disabled} 
    style=
    {{ opacity: disabled ? 0.5 : 1, 
    padding: 10, 
    backgroundColor: '#0c0cba',
    borderRadius: 5 
    }}>
      <Text 
      style={{ color: 'white',
      textAlign: 'center',
      fontSize:16, 
      fontWeight: '600' 
      }}>{title}</Text>
    </Pressable>
  );
}