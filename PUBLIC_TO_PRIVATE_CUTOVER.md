
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
1. **For the initial cutover,** you must modify the nginx proxy to skip caching for ALL resources or you may not get the correct configuration values. Change the following line to `expires 0;`: https://github.com/usdot-jpo-sdc-projects/sdc-dot-web-proxy/blob/30e7e99431abb6dc5b2b5a81885c3ed9cce066e5/terraform/nginx/default.nginx.conf#L13 - you can either do this manually on the live instances, or run a `terraform apply` and replace the proxy instance.
1. Modify the Route 53 record to point to the nginx load balancer instead of Cloudfront

## Note: Existing bucket caching

It should be fine to let the existing bucket cache until we replace its contents. It's possible that some clients would still be hitting cloudfront briefly until the DNS propagates, but once it does the nginx configuration will evict that cache. We will also be replacing the bucket contents to remove the metadata directive, which will also prevent any unusual caching.

## Move into the existing bucket

We have been using a one-off bucket for the customized private API webportal. Now that it is stable, we can use the correct bucket and update the proxy to pull from that bucket.

1. Modify `static_assets_bucket` to the be existing bucket: https://github.com/usdot-jpo-sdc-projects/sdc-dot-web-proxy/blob/30e7e99431abb6dc5b2b5a81885c3ed9cce066e5/terraform/config/dev.tfvars#L17
1. Run the SSM script to update our live proxies
1. Make a PR to commit the bucket change into develop/master

_**Footnote:** You can also terminate the live EC2 instances so they get refreshed with the correct bucket, but you should only do this if there are 2 or more instances to avoid downtime._

## Verify everything is stable

Take a moment to verify everything is stable before doing cleanup.

## Clean up - After 1 day?

Due to the way caching is set up, unless we had hashes into our relative CSS/JS links, I think we will need to wait 24 hours before we can safely re-enable caching.

1. Reset nginx caching back to `expires 86400;` manually or with terraform
1. Delete the private bucket
1. I believe we can delete `webportal-hsts` as it's handled by nginx now