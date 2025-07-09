//
//  LWAModule.h
//  cloudstorage
//
//  Created by khayyam on 02/01/2023.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"

#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#endif

#import <LoginWithAmazon/LoginWithAmazon.h>

#import <Foundation/Foundation.h>

@interface LWAModule : RCTEventEmitter <RCTBridgeModule>

@end
