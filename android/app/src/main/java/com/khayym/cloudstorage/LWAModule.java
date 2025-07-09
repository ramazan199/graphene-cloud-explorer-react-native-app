package com.khayym.cloudstorage;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;
import com.amazon.identity.auth.device.api.workflow.RequestContext;
import com.amazon.identity.auth.device.api.authorization.*;
import com.amazon.identity.auth.device.api.Listener;
import com.amazon.identity.auth.device.AuthError;
import com.amazon.identity.auth.device.api.authorization.AuthorizationManager;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import com.amazon.identity.auth.device.AuthError;
import com.amazon.identity.auth.device.api.Listener;
import com.amazon.identity.auth.device.api.authorization.AuthCancellation;
import com.amazon.identity.auth.device.api.authorization.AuthorizationManager;
import com.amazon.identity.auth.device.api.authorization.AuthorizeListener;
import com.amazon.identity.auth.device.api.authorization.AuthorizeRequest;
import com.amazon.identity.auth.device.api.authorization.AuthorizeResult;
import com.amazon.identity.auth.device.api.authorization.ProfileScope;
import com.amazon.identity.auth.device.api.authorization.Scope;
import com.amazon.identity.auth.device.api.authorization.User;
import com.amazon.identity.auth.device.api.workflow.RequestContext;
import org.json.JSONObject;
import org.json.JSONException;


public class LWAModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private final ReactApplicationContext reactContext;
    private RequestContext requestContext;
    // private static final String PRODUCT_ID = "INSERT YOUR PRODUCT ID FROM AMAZON DEVELOPER CONSOLE";
    // private static final String PRODUCT_DSN = "INSERT UNIQUE DSN FOR YOUR DEVICE";
    // private static final String CODE_CHALLENGE = "INSERT CODE CHALLENGE FROM DEVICE FOR THIS REQUEST";
    private static final String CODE_CHALLENGE_METHOD = "S256";

    LWAModule(ReactApplicationContext context) {
        super(context);

        this.reactContext = context;

        this.requestContext = RequestContext.create(context);
    }

    @Override
    public String getName() {
        return "LWAModule";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String testModule() {
        return "module connect";
    }


    @Override
    public void onHostResume() {
        this.requestContext.onResume();
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
    }

    @ReactMethod
    public void login(String PRODUCT_ID, String CODE_CHALLENGE, String PRODUCT_DSN) {
        final JSONObject scopeData = new JSONObject();
        final JSONObject productInstanceAttributes = new JSONObject();
      
        this.requestContext.registerListener(new AuthorizeListener() {

            /* Authorization was completed successfully. */
            @Override
            public void onSuccess(AuthorizeResult result) {
                final String authorizationCode = result.getAuthorizationCode();
                final String clientId = result.getClientId();
                final String redirectUri = result.getRedirectURI();
                /* Your app is now authorized for the requested scopes */
                WritableMap userInfo = Arguments.createMap();
                userInfo.putString("authorizationCode",authorizationCode);
                userInfo.putString("clientId",clientId);
                userInfo.putString("redirectUri", redirectUri);
                // System.out.print(result);
                // userInfo.putString("email", result.getUser().getUserEmail());
                // userInfo.putString("name", result.getUser().getUserName());
                // userInfo.putString("user_id", result.getUser().getUserId());
                // userInfo.putString("postalCode", result.getUser().getUserPostalCode());
                // userInfo.putString("token", result.getAccessToken());
                // userInfo.putString("authorizationCode", authorizationCode);
                sendEvent(reactContext, "AmazonAuthEvent", userInfo);
                // userInfo.putString("clientId", clientId);
            }


            /* There was an error during the attempt to authorize the
            application. */
            @Override
            public void onError(AuthError ae) {
                /* Inform the user of the error */
                WritableMap error = Arguments.createMap();
                error.putString("error", ae.toString());
                sendEvent(reactContext, "AmazonAuthEvent", error);
            }

            /* Authorization was cancelled before it could be completed. */
            @Override
            public void onCancel(AuthCancellation cancellation) {
                /* Reset the UI to a ready-to-login state */
                WritableMap error = Arguments.createMap();
                error.putString("error", "The user cancelled the operation.");
                sendEvent(reactContext, "AmazonAuthEvent", error);
            }
        });

        try{
            productInstanceAttributes.put("deviceSerialNumber", PRODUCT_DSN);
            scopeData.put("productInstanceAttributes", productInstanceAttributes);
            scopeData.put("productID", PRODUCT_ID);

            AuthorizationManager.authorize(new AuthorizeRequest
                    .Builder(requestContext)
                    .addScopes(ProfileScope.profile(), ProfileScope.postalCode(), ScopeFactory.scopeNamed("alexa:voice_service:pre_auth"),
                    ScopeFactory.scopeNamed("alexa:all", scopeData))
                    .forGrantType(AuthorizeRequest.GrantType.AUTHORIZATION_CODE)
                    .withProofKeyParameters(CODE_CHALLENGE, CODE_CHALLENGE_METHOD)
                    .build()
            );
        }catch (JSONException e) {
                 // handle exception here
             }
    }

    @ReactMethod
    public void checkIsUserSignedIn() {
        Scope[] scopes = {
                ProfileScope.profile(),
                ProfileScope.postalCode()
        };

        AuthorizationManager.getToken(this.reactContext, scopes, new Listener < AuthorizeResult, AuthError > () {

            @Override
            public void onSuccess(AuthorizeResult result) {
                if (result.getAccessToken() != null) {
                    /* The user is signed in */
                    User.fetch(reactContext, new Listener<User, AuthError>() {
                        /* fetch completed successfully. */
                        @Override
                        public void onSuccess(User user) {
                            WritableMap userInfo = Arguments.createMap();
                            userInfo.putString("email", user.getUserEmail());
                            userInfo.putString("name", user.getUserName());
                            userInfo.putString("user_id", user.getUserId());
                            userInfo.putString("postalCode", user.getUserPostalCode());
                            userInfo.putString("token", result.getAccessToken());

                            sendEvent(reactContext, "AmazonAuthEvent", userInfo);
                        }

                        /* There was an error during the attempt to get the profile. */
                        @Override
                        public void onError(AuthError ae) {

                            WritableMap error = Arguments.createMap();
                            error.putString("error", "User not signed in");
                            sendEvent(reactContext, "AmazonAuthEvent", error);
                        }
                    });
                } else {
                    WritableMap error = Arguments.createMap();
                    error.putString("error", "User not signed in");
                    sendEvent(reactContext, "AmazonAuthEvent", error);                }
            }

            @Override
            public void onError(AuthError ae) {
                /* The user is not signed in */
                WritableMap error = Arguments.createMap();
                error.putString("error", "User not signed in");
                sendEvent(reactContext, "AmazonAuthEvent", error);            }
        });
    }


    @ReactMethod
    public void logout() {
        AuthorizationManager.signOut(getReactApplicationContext(), new Listener < Void, AuthError > () {
            @Override
            public void onSuccess(Void response) {
                // Set logged out state in UI
            }
            @Override
            public void onError(AuthError authError) {
                // Log the error
            }
        });
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

}
