# DigitalOcean Deployments for Sanity with NextJS

This is a deployment tool for Sanity with NextJS installations.

This is in somewhat early development. I may scrap this and build a more-expansive version that supports other platforms like Heroku and Render.com.

It is intended to be used with self-hosted Sanity installations. It would probably work with Sanity-hosted installations, but you’ll need to set up CORS permissions between Sanity and your NextJS API.

This does not work with fully static exports; an API route is required because requests to outside APIs are generally not possible from the client.

_note:_ I am probably going to to deprecate this entire project in favor of one that supports multiple hosting platforms.

## Instructions

### Set up in NextJS

You’ll need to set up an endpoint for deployments from Sanity Studio.

Create a folder in `/src/app/api` called `deploy`, and a file there called `route.ts`.

In `route.ts`, add the following lines:

```typescript
import { initializeDeployment, checkDeployment } from "sanity-nextjs-do-deploy/sanity"

const digitalOceanToken = process.env.DIGITAL_OCEAN_TOKEN
const digitalOceanAppId = process.env.DIGITAL_OCEAN_APP_ID

export const POST = initializeDeployment(digitalOceanToken, digitalOceanAppId)

export const GET = checkDeployment(digitalOceanToken, digitalOceanAppId)
```

You can use a different route if you like, just be sure to edit the `apiEndpoint` option in the `sanity.config.js` deployOptions as per above.

### Set up in Sanity

In your `sanity.config.ts`, add the new menu option to the Tool Menu of your Studio.

note: It’s called `WrappedDeployTool` because it includes a loader for your existing options — otherwise the Structure and Vision tools at the top of your Studio would disappear!

```typescript
import {defineConfig} from 'sanity'
import {WrappedDeployTool} from 'sanity-nextjs-do-deploy/routes'

export default defineConfig({
  ...
  studio: {
    components: {
      toolMenu: WrappedDeployTool(),
    },
  },
})
```

#### Options

- customize the "toast" popup messaging
- change the NextJS api endpoint
- require confirmation from the user

```typescript
const deployOptions = {
  // How long will a "Success" or "Error" toast stay visible?
  successOrErrorDuration: 60000, // 1 minute
  // How often will the script check the deployment progress?
  checkProgressInterval: 30000, // 30 seconds
  // Deployment progress message.
  estimatedDeploymentDurationMessage: "Est. 7 minutes",
  // Suppress “toast” messages altogether.
  suppressToasts: false,
  // Custom API endpoint.
  apiEndpoint: '/api/deploy',
  // Require confirmation from user.
  // Omit or leave undefined (default) to proceed on click with no confirmation.
  // Enter "true" for a simple confirmation message:
  //   "This will redeploy the website with ALL published content. Proceed?"
  requireConfirmation: true,
  // Enter a string for a custom message.
  requireConfirmation: "Ready to go?",
}

export default defineConfig({
  ...
  studio: {
    components: {
      toolMenu: WrappedDeployTool(deployOptions),
    },
  },
})
```

#### Note for custom tool menus

If you already have a custom Tool Menu, you can insert the `DeployTool`.

```typescript
import {defineConfig} from 'sanity'
import {DeployTool} from 'sanity-nextjs-do-deploy'

const deployOptions = { /* see list above */ }

export default defineConfig({
  ...
  studio: {
    components: {
      toolMenu: (props: any) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {props.renderDefault(props)}
          /* stuff you've already inserted */
          <DeployTool options={deployOptions} />
        </div>
      ),
    },
  },
})
```

### Next steps

A new button will appear in the top center of your Sanity Studio. Explain that to your users. Donezo.

## Notes

This is probably compatible with the "pages router" but I haven't used it in a while. If there's any desire, I'll look into it.

If I restart this dev, use plugin-kit
https://www.sanity.io/docs/studio/developing-plugins#k2ad0148ea85e

todo: WrappedDeployTool.tsx needs to be responsive
