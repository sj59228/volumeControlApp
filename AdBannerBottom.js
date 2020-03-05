import React from 'react';
import {BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';

const AdBannerBottom = () => (
  <BannerAd
    //unitId={TestIds.BANNER}
    unitId="ca-app-pub-6389021328817927/8881161212"
    size={BannerAdSize.SMART_BANNER}
    requestOptions={{
      requestNonPersonalizedAdsOnly: true,
    }}
    // onAdLoaded={function() {
    //   console.log('Advert loaded');
    // }}
    // onAdFailedToLoad={function(error) {
    //   console.error('Advert failed to load: ', error);
    // }}
  />
);

export default AdBannerBottom;
