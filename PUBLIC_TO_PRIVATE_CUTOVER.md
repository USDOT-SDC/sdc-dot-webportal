
# Public to Private cutover

This is a small guide on how to transition an environment from public to private. For this example, we'll make a private version of `dev`, but the same concept will apply for `prod` as well.

## Verifying the private configuration in a standalone DNS

1. Manually create a bucket to house the static resources. After the cutover is successful, this bucket can be deleted.
1. Add a `dev-private` stage into the Chalice `webportal/lambda/.chalice/config.json`
1. Add a new policy at `webportal/lambda/.chalice/policy-dev-private.json`
1. Deploy the `dev-private` version once, then update the config values for `RESTAPIID` and `AUTHORIZERID`
1. Create an Angular `environment.dev-private.ts` file to use the standlaone DNS _(e.g. `dev-proxy-portal.securedatacommons.com`)_

At this point, you should verify it is stable in a distinct DNS.

## Doing the cutover in the preexisting DNS

Now that the cutover is about to occur, you will need to update configurations to use the preexisting DNS. This means that the standalone DNS will likely become unstable, but that's OK.

1. Modify the `environment.dev-private.ts` file to use the preexisting DNS _(e.g. `dev-portal.securedatacommons.com`)_ and re-deploy it to S3.
1. Add a new certificate into Sophos for the existing DNS (if one does not already exist)
1. Add a new `Virtual webserver` into Sophos. It can reuse the existing `Real webserver` that was made for the proxy.
1. Modify the Route 53 record to point to the nginx load balancer instead of Cloudfront

## Note: Existing bucket caching

**The current assets in dev do not cache bust** - I've added cache busting into the dev config to more accurately simulate prod.

Until a client does a hard refresh, they'll still be using CloudFront, but it will still function normally. Whenever they do a hard refresh, they will need to log in again, but otherwise everything behaves normally.

## Move into the existing bucket

We have been using a one-off bucket for the customized private API webportal. Now that it is stable, we can use the correct bucket and update the proxy to pull from that bucket.

1. Modify `static_assets_bucket` to the be existing bucket: https://github.com/usdot-jpo-sdc-projects/sdc-dot-web-proxy/blob/30e7e99431abb6dc5b2b5a81885c3ed9cce066e5/terraform/config/dev.tfvars#L17
1. Run the SSM script to update our live proxies
1. Make a PR to commit the bucket change into develop/master

_**Footnote:** You can also terminate the live EC2 instances so they get refreshed with the correct bucket, but you should only do this if there are 2 or more instances to avoid downtime._

## Verify everything is stable

Take a moment to verify everything is stable before doing cleanup.

### Verification scenarios

1. User not logged in - No impact. They will log in as normal and receive traffix via proxy.
1. User using workstation - No impact. This uses a distinct DNS.

#### User actively logged in

There are a few scenarios for an actively logged in user

1. No hard refresh - site will continue to function as usual until a hard refresh occurs
1. Hard refresh - user will likely require a new session and be logged out
1. Bucket cutover - This should behave the same as "no hard refresh", but it _very unlikely_ as we won't swap buckets until the private variant has been stable, and the user would have needed to have an active session for multiple days.

## Clean up and soft shutdown - After a few days or so?

1. Disable cloudfront & API Gateways
1. Delete the private bucket
1. I believe we can delete `webportal-hsts` as it's handled by nginx now