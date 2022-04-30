import { Text, View } from '../components/Themed';

export type Props = {
  name: string;
  horizontalOffset: number;
  verticalOffset: number;
}

export default function LocationMarker({
  name,
}: Props) {
  return (
    <View>
      <Text>{name}</Text>
    </View>
  )
}