import { registerRoot } from "remotion"

import Matt from "./compositions/matt"
import Delba from "./compositions/delba"

registerRoot(function RemotionRoot() {
  return (
    <>
      <Matt />
      <Delba />
    </>
  )
})
