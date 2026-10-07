import type { ThreeElements } from '@react-three/fiber'

declare module 'react' {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- JSX tiplerini birleştirmek için boş interface gerekli
    interface IntrinsicElements extends ThreeElements {}
  }
}
