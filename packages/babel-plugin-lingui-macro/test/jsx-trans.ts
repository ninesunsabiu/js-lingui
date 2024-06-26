import { TestCase } from "./index"

const cases: TestCase[] = [
  {
    name: "Generate ID from message",
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>Hello World</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"mY42CM"} message={"Hello World"} />;
      `,
  },
  {
    name: "Generate different id when context provided",
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>Hello World</Trans>;
        <Trans context="my context">Hello World</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"mY42CM"} message={"Hello World"} />;
        <_Trans id={"SO/WB8"} message={"Hello World"} context="my context" />;
      `,
  },
  {
    name: "Preserve custom ID (string literal)",
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans id="msg.hello">Hello World</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id="msg.hello" message={"Hello World"} />;
      `,
  },
  {
    name: "Preserve custom ID (literal expression)",
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans id={"msg.hello"}>Hello World</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id="msg.hello" message={"Hello World"} />;
      `,
  },
  {
    name: "Preserve custom ID (template expression)",
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans id={\`msg.hello\`}>Hello World</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id="msg.hello" message={"Hello World"} />;
      `,
  },
  {
    name: "Should preserve reserved props: `comment`, `context`, `render`, `id`",
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans
          comment="Comment for translator"
          context="translation context"
          id="custom.id"
          render={() => {}}
        >Hello World</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans
          render={() => {}}
          id="custom.id"
          message={"Hello World"}
          comment="Comment for translator"
          context="translation context"
        />;
      `,
  },
  {
    stripId: true,
    name: "Trans macro could be renamed",
    input: `
        import { Trans as Trans2 } from '@lingui/react/macro';
        <Trans2>Hello World</Trans2>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"<stripped>"} message={"Hello World"} />;
      `,
  },
  {
    name: "Variables are converted to named arguments",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>Hi {yourName}, my name is {myName}</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans 
          id={"<stripped>"}
          message={"Hi {yourName}, my name is {myName}"}
          values={{
            yourName: yourName,
            myName: myName,
          }} 
        />;
      `,
  },
  {
    name: "Variables are deduplicated",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>{duplicate} variable {duplicate}</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans
          id={"<stripped>"}
          message={"{duplicate} variable {duplicate}"} 
          values={{
            duplicate: duplicate
          }} 
        />;
      `,
  },
  {
    name: "Quoted JSX attributes are handled",
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>Speak "friend"!</Trans>;
        <Trans id="custom-id">Speak "friend"!</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"NWmRwM"} message={'Speak "friend"!'} />;
        <_Trans id="custom-id" message={'Speak "friend"!'} />;
      `,
  },
  {
    name: "HTML attributes are handled",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>
          <Text>This should work &nbsp;</Text>
        </Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans 
          id={"<stripped>"} 
          message={"<0>This should work \\xA0</0>"}
           components={{
             0: <Text />,
           }}
        />;
      `,
  },
  {
    name: "Template literals as children",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>{\`How much is \${expression}? \${count}\`}</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans 
          id={"<stripped>"} 
          message={"How much is {expression}? {count}"} values={{
            expression: expression,
            count: count
          }} 
        />;
      `,
  },
  {
    name: "Strings as children are preserved",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>{"hello {count, plural, one {world} other {worlds}}"}</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans 
          id={"<stripped>"} 
          message={"hello {count, plural, one {world} other {worlds}}"} 
        />;
      `,
  },
  {
    name: "Expressions are converted to positional arguments",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>
          Property {props.name},
          function {random()},
          array {array[index]},
          constant {42},
          object {new Date()},
          everything {props.messages[index].value()}
        </Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans 
          id={"<stripped>"}
          message={"Property {0}, function {1}, array {2}, constant {3}, object {4}, everything {5}"} 
          values={{
            0: props.name,
            1: random(),
            2: array[index],
            3: 42,
            4: new Date(),
            5: props.messages[index].value()
          }} 
        />;
      `,
  },
  {
    name: "JSX Macro inside JSX conditional expressions",
    stripId: true,
    input: `
       import { Trans } from '@lingui/react/macro';
       <Trans>Hello, {props.world ? <Trans>world</Trans> : <Trans>guys</Trans>}</Trans>
      `,
    expected: `
        import { Trans as _Trans } from '@lingui/react';

        <_Trans
          id={'<stripped>'}
          message={"Hello, {0}"}
          values={{
            0: props.world ? <_Trans id={"<stripped>"} message={'world'} /> : <_Trans id={'<stripped>'} message={'guys'} />
          }}
        />
      `,
  },
  {
    name: "JSX Macro inside JSX multiple nested conditional expressions",
    stripId: true,
    input: `
      import { Trans } from '@lingui/react/macro';
      <Trans>Hello, {props.world ? <Trans>world</Trans> : (
        props.b
          ? <Trans>nested</Trans>
          : <Trans>guys</Trans>
      )
    }</Trans>
      `,
    expected: `
      import { Trans as _Trans } from "@lingui/react";
      <_Trans
        id={"<stripped>"}
        message={"Hello, {0}"}
        values={{
          0: props.world ? (
            <_Trans id={"<stripped>"} message={"world"} />
          ) : props.b ? (
            <_Trans id={"<stripped>"} message={"nested"} />
          ) : (
            <_Trans id={"<stripped>"} message={"guys"} />
          ),
        }}
      />;
      `,
  },
  {
    name: "Elements are replaced with placeholders",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>
          Hello <strong>World!</strong><br />
          <p>
            My name is <a href="/about">{" "}
            <em>{name}</em></a>
          </p>
        </Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans 
          id={"<stripped>"}
          message={"Hello <0>World!</0><1/><2>My name is <3> <4>{name}</4></3></2>"} 
          values={{
            name: name
          }} 
          components={{
            0: <strong />,
            1: <br />,
            2: <p />,
            3: <a href="/about" />,
            4: <em />
          }} 
        />;
      `,
  },
  {
    name: "Elements inside expression container",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>{<span>Component inside expression container</span>}</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans
          id={"<stripped>"}
          message={"<0>Component inside expression container</0>"} 
          components={{
            0: <span />
          }} 
        />;
      `,
  },
  {
    name: "Elements without children",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>{<br />}</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"<stripped>"} message={"<0/>"} components={{
          0: <br />
        }} />;
      `,
  },
  {
    name: "Production - only essential props are kept",
    production: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans id="msg.hello" context="my context" comment="Hello World">Hello World</Trans>
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id="msg.hello" />;
      `,
  },
  {
    name: "Production - all props kept if extract: true",
    production: true,
    macroOpts: {
      extract: true,
    },
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans id="msg.hello" comment="Hello World">Hello World</Trans>
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id="msg.hello" message={"Hello World"} comment="Hello World"/>;
      `,
  },
  {
    name: "Production - import type doesn't interference on normal import",
    production: true,
    useTypescriptPreset: true,
    input: `
        import type { withI18nProps } from '@lingui/react'
        import { Trans } from '@lingui/react/macro';
        <Trans id="msg.hello" comment="Hello World">Hello World</Trans>
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id="msg.hello" />;
      `,
  },
  {
    name: "Strip whitespace around arguments",
    stripId: true,
    input: `
        import { Trans } from "@lingui/react/macro";
        <Trans>
          Strip whitespace around arguments: '
          {name}
          '
        </Trans>
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"<stripped>"} message={"Strip whitespace around arguments: '{name}'"} values={{
          name: name
        }} />;
      `,
  },
  {
    name: "Strip whitespace around tags but keep forced spaces",
    stripId: true,
    input: `
        import { Trans } from "@lingui/react/macro";
        <Trans>
          Strip whitespace around tags, but keep{" "}
          <strong>forced spaces</strong>
          !
        </Trans>
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"<stripped>"} message={"Strip whitespace around tags, but keep <0>forced spaces</0>!"} components={{
          0: <strong />
        }} />;
      `,
  },
  {
    name: "Strip whitespace around tags but keep whitespaces in JSX containers",
    stripId: true,
    input: `
      import { Trans } from "@lingui/react/macro";
        <Trans>
        {"Wonderful framework "}
        <a href="https://nextjs.org">Next.js</a>
        {" say hi. And "}
        <a href="https://nextjs.org">Next.js</a>
        {" say hi."}
      </Trans>
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
<_Trans
  id={"<stripped>"}
  message={
    "Wonderful framework <0>Next.js</0> say hi. And <1>Next.js</1> say hi."
  }
  components={{
    0: <a href="https://nextjs.org" />,
    1: <a href="https://nextjs.org" />,
  }}
/>;
;
      `,
  },
  {
    name: "Keep forced newlines",
    stripId: true,
    filename: "./jsx-keep-forced-newlines.js",
  },
  {
    name: "Use a js macro inside a JSX Attribute of a component handled by JSX macro",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        import { t } from '@lingui/core/macro';
        <Trans>Read <a href="/more" title={t\`Full content of \${articleName}\`}>more</a></Trans>
      `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        import { Trans as _Trans } from "@lingui/react";
        <_Trans
          id={"<stripped>"}
          message={"Read <0>more</0>"}
          components={{
            0: (
              <a
                href="/more"
                title={_i18n._(
                  /*i18n*/
                  {
                    id: "qzc3IN",
                    message: "Full content of {articleName}",
                    values: {
                      articleName: articleName,
                    },
                  }
                )}
              />
            ),
          }}
        />;

      `,
  },
  {
    name: "Use a js macro inside a JSX Attribute of a non macro JSX component",
    input: `
        import { plural } from '@lingui/core/macro';
        <a href="/about" title={plural(count, {
          one: "# book",
          other: "# books"
        })}>About</a>
      `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
         <a
            href="/about"
            title={_i18n._(
              /*i18n*/
              {
                id: "esnaQO",
                message: "{count, plural, one {# book} other {# books}}",
                values: {
                  count: count,
                },
              }
            )}
          >
            About
          </a>;
      `,
  },
  {
    name: "Ignore JSXEmptyExpression",
    stripId: true,
    input: `
        import { Trans } from '@lingui/react/macro';
        <Trans>Hello {/* and I cannot stress this enough */} World</Trans>;
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"<stripped>"} message={"Hello  World"} />;
      `,
  },
  {
    name: "Use decoded html entities",
    stripId: true,
    input: `
        import { Trans } from "@lingui/react/macro";
        <Trans>&amp;</Trans>
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        <_Trans id={"<stripped>"} message={"&"} />;
      `,
  },
  {
    name: "Should not process non JSXElement nodes",
    useTypescriptPreset: true,
    stripId: true,
    input: `
        import { Trans } from "@lingui/react/macro";
        type X = typeof Trans;
        const cmp = <Trans>Hello</Trans>
      `,
    expected: `
        import { Trans as _Trans } from "@lingui/react";
        const cmp = <_Trans id={"<stripped>"} message={"Hello"} />;
      `,
  },
]
export default cases
