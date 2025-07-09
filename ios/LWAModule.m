//
//  LWAModule.m
//  cloudstorage
//
//  Created by khayyam on 02/01/2023.
//


#import "LWAModule.h"
#import <React/RCTLog.h>
#import <LoginWithAmazon/LoginWithAmazon.h>

@implementation LWAModule

RCT_EXPORT_MODULE()


- (NSArray<NSString *> *)supportedEvents
{
  return @[@"AmazonAuthEvent"];
}

// Called when the user taps the Login with Amazon Button
// Redirects to the Amazon sign on page
RCT_EXPORT_METHOD(login:(NSString *)productId codeChallenge:(NSString *)codeChallenge productDsn:(NSString *) productDsn)
{
  
  NSDictionary *scopeData = @{@"productID": productId,
                              @"productInstanceAttributes": @{@"deviceSerialNumber": productDsn}};
  
  id alexaAllScope = [AMZNScopeFactory scopeWithName:@"alexa:all" data:scopeData];
  
  id<AMZNScope> alexaSplashScope = [AMZNScopeFactory scopeWithName:@"alexa:voice_service:pre_auth"];
  
  AMZNAuthorizeRequest *request = [[AMZNAuthorizeRequest alloc] init];
  request.scopes = @[alexaSplashScope, alexaAllScope];
  request.codeChallenge = codeChallenge;
  request.codeChallengeMethod = @"S256";
  request.grantType = AMZNAuthorizationGrantTypeCode;
  
  AMZNAuthorizationManager *authManager = [AMZNAuthorizationManager sharedManager];
  
  [authManager authorize:request withHandler:^(AMZNAuthorizeResult *result, BOOL userDidCancel, NSError *error) {
      if (error) {
          // Notify the user that authorization failed
        [self sendEventWithName:@"AmazonAuthEvent" body:@{@"error": [error userInfo]}];
      } else if (userDidCancel) {
          // Notify the user that the authorization was cancelled
        [self sendEventWithName:@"AmazonAuthEvent" body:@{@"error": @"User cancelled login with amazon"}];
      } else {
          // Fetch the authorization code and return to controller
        NSString *authorizationCode = result.authorizationCode;
        NSString *clientId = result.clientId;
        NSString *redirectUri = result.redirectUri;
        
//          self.authorizationCode = result.authorizationCode;
//          self.clientId = result.clientId;
//          self.redirectUri = result.redirectUri;
        [self sendEventWithName:@"AmazonAuthEvent" body:@{
          @"clientId":clientId,
          @"authorizationCode":authorizationCode,
          @"redirectUri":redirectUri
        }];
        
//        ---
        // Authentication was successful.
        // Obtain the access token and user profile data.
      }
  }];
}

  
RCT_EXPORT_METHOD(checkIsUserSignedIn) {
    // Make authorize call to SDK using AMZNInteractiveStrategyNever to detect whether there is an authenticated user. While making this call you can specify scopes for which user authorization is needed. If this call returns error, it means either there is no authenticated user, or at least of the requested scopes are not authorized. In both case you should show sign in page again.
    
    // Build an authorize request.
    AMZNAuthorizeRequest *request = [[AMZNAuthorizeRequest alloc] init];
    
    // Requesting 'profile' scopes for the current user.
    request.scopes = [NSArray arrayWithObject:[AMZNProfileScope profile]];
    
    // Set interactive strategy as 'AMZNInteractiveStrategyNever'.
    request.interactiveStrategy = AMZNInteractiveStrategyNever;
    
   // Make an Authorize call to the Login with Amazon SDK.
    [[AMZNAuthorizationManager sharedManager] authorize:request
                                            withHandler:^(AMZNAuthorizeResult *result, BOOL
                                                          userDidCancel, NSError *error) {
                                                if (error) {
                                                    [self sendEventWithName:@"AmazonAuthEvent" body:@{@"error": [error userInfo]}];
                                                } else if (userDidCancel) {
                                                    [self sendEventWithName:@"AmazonAuthEvent" body:@{@"error": @"User not signed in"}];
                                                } else {
                                                    // Authentication was successful.
                                                    // Obtain the access token and user profile data.
                                                    NSString *accessToken = result.token;
                                                    AMZNUser *user = result.user;
                                                    NSString *userID = user.profileData[@"userID"] ? user.profileData[@"userID"] : @"";
                                                    NSString *postalCode = user.profileData[@"postalCode"] ? user.profileData[@"postalCode"] : @"";

                                                    [self sendEventWithName:@"AmazonAuthEvent" body:
                                                         @{
                                                             @"email": user.profileData[@"email"],
                                                             @"name": user.profileData[@"name"],
                                                             @"user_id": userID,
                                                             @"postalCode": postalCode,
                                                             @"token": accessToken
                                                         }
                                                    ];
                                                }
                                            }];
}

// Call to fetch the user's account information as long as they are already logged in/authorized
RCT_EXPORT_METHOD(fetchUserData:(RCTResponseSenderBlock)callback)
{
    [AMZNUser fetch:^(AMZNUser *user, NSError *error) {
        if (error) {
            callback(@[[error userInfo]]);
        } else if (user) {
            callback(@[[NSNull null], user.profileData]);
        }
    }];
}

// Logs the user out
RCT_EXPORT_METHOD(logout:(RCTResponseSenderBlock)callback)
{
    [self logoutAmazon];
    [self logoutAmazon];
}

- (void)logoutAmazon {
    [[AMZNAuthorizationManager sharedManager] signOut:^(NSError * _Nullable error) {
        if (error) {
            // callback(@[[error userInfo]]);
        } else {
            // callback(@[[NSNull null]]);
        }
    }];
}

@end
