---
id: faastjs.faastaws
title: faastAws() function
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[faastjs](./faastjs.md) &gt; [faastAws](./faastjs.faastaws.md)

## faastAws() function

The main entry point for faast with AWS provider.

<b>Signature:</b>

```typescript
export declare function faastAws<M extends object>(fmodule: M, options?: AwsOptions): Promise<AwsFaastModule<M>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  fmodule | <code>M</code> | A module imported with <code>import * as X from &quot;Y&quot;;</code>. Using <code>require</code> also works but loses type information. |
|  options | <code>AwsOptions</code> | Most common options are in [CommonOptions](./faastjs.commonoptions.md)<!-- -->. Additional AWS-specific options are in [AwsOptions](./faastjs.awsoptions.md)<!-- -->. |

<b>Returns:</b>

`Promise<AwsFaastModule<M>>`

a Promise for [AwsFaastModule](./faastjs.awsfaastmodule.md)<!-- -->.
