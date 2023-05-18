import React, { FC, useEffect, useState } from "react";
import HeaderFilterSection from "components/HeaderFilterSection";
import CardNFT2 from "components/CardNFT2";
import ButtonPrimary from "shared/Button/ButtonPrimary";

import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "Ii219uc0Xq4cTvkIeQJD-nHwfi84BHJO",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

//
export interface SectionGridFeatureNFT2Props {}

const SectionGridFeatureNFT2: FC<SectionGridFeatureNFT2Props> = () => {
  const [nfts, setNfts] = useState<any>([]);

  const getNfts = async (address: string) => {
    // Flag to omit metadata
    const omitMetadata = false;

    // Get all NFTs
    const { nfts } = await alchemy.nft.getNftsForContract(address, {
      omitMetadata: omitMetadata,
    });
    setNfts(nfts);
  };
  useEffect(() => {
    getNfts("0x2b8d14bf74741d33e814978816e7c36b9802e568");
  }, []);
  console.log(nfts);
  return (
    <div className="nc-SectionGridFeatureNFT2 relative">
      <HeaderFilterSection />
      <div className={`grid gap-6 lg:gap-8 sm:grid-cols-2 xl:grid-cols-3`}>
        {Array.from("111111").map((_, index) => (
          <CardNFT2
            key={index}
            item={nfts[Math.floor(1 + Math.random() * 99)]}
          />
        ))}
      </div>
      {/* <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary loading>Show me more</ButtonPrimary>
      </div> */}
    </div>
  );
};

export default SectionGridFeatureNFT2;
