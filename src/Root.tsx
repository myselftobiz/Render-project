import { Composition } from "remotion";
import { IceCarrierShort } from "./videos/ice-carrier/IceCarrier";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="IceCarrierShort" component={IceCarrierShort} durationInFrames={2485} fps={30} width={1440} height={2560} />
    </>
  );
};
