import { TestCase } from "./index"

const cases: TestCase[] = [
  {
    name: "Macro is used in expression assignment",
    input: `
        import { t } from '@lingui/core/macro';
        const a = t\`Expression assignment\`;
    `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        const a = _i18n._(
          /*i18n*/
          {
            id: "mjnlP0",
            message: "Expression assignment",
          }
        );
    `,
  },
  {
    name: "Macro is used in call expression",
    input: `
        import { t } from '@lingui/core/macro';
        const msg = message.error(t({message: "dasd"}))
    `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        const msg = message.error(
          _i18n._(
            /*i18n*/
            {
              message: "dasd",
              id: "9ZMZjU",
            }
          )
        );
    `,
  },
  {
    name: "t`` macro could be renamed",
    input: `
        import { t as t2 } from '@lingui/core/macro';
        const a = t2\`Expression assignment\`;
    `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        const a = _i18n._(
          /*i18n*/
          {
            id: "mjnlP0",
            message: "Expression assignment",
          }
        );
    `,
  },
  {
    name: "Macro is used in expression assignment, with custom lingui instance",
    input: `
        import { t } from '@lingui/core/macro';
        import { customI18n } from './lingui';
        const a = t(customI18n)\`Expression assignment\`;
    `,
    expected: `
       import { customI18n } from './lingui';
       const a = customI18n._(
        /*i18n*/
        {
          id: "mjnlP0",
          message: "Expression assignment",
        }
      );
    `,
  },
  {
    name: "Variables are replaced with named arguments",
    input: `
        import { t } from '@lingui/core/macro';
        t\`Variable \${name}\`;
    `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        _i18n._(
          /*i18n*/
          {
            id: "xRRkAE",
            message: "Variable {name}",
            values: {
              name: name,
            },
          }
        );
    `,
  },
  {
    name: "Variables with escaped template literals are correctly formatted",
    input: `
        import { t } from '@lingui/core/macro';
        t\`Variable \\\`\${name}\\\`\`;
    `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        _i18n._(
          /*i18n*/
          {
            id: "ICBco+",
            message: "Variable \`{name}\`",
            values: {
              name: name,
            },
          }
        );
    `,
  },
  {
    name: "Variables with escaped double quotes are correctly formatted",
    input: `
        import { t } from '@lingui/core/macro';
        t\`Variable \"name\"\`;
    `,
    expected: `
       import { i18n as _i18n } from "@lingui/core";
       _i18n._(
        /*i18n*/
        {
          id: "CcPIZW",
          message: 'Variable "name"',
        }
      );
    `,
  },
  {
    name: "Variables should be deduplicated",
    input: `
        import { t } from '@lingui/core/macro';
        t\`\${duplicate} variable \${duplicate}\`;
    `,
    expected: `
      import { i18n as _i18n } from "@lingui/core";
      _i18n._(
        /*i18n*/
        {
          id: "+nhkwg",
          message: "{duplicate} variable {duplicate}",
          values: {
            duplicate: duplicate,
          },
        }
      );
    `,
  },
  {
    name: "Anything variables except simple identifiers are used as positional arguments",
    input: `
        import { t } from '@lingui/core/macro';
        t\`\
 Property \${props.name},\
 function \${random()},\
 array \${array[index]},\
 constant \${42},\
 object \${new Date()}\
 anything \${props.messages[index].value()}\
\`
`,
    expected: `
      import { i18n as _i18n } from "@lingui/core";
      _i18n._(
        /*i18n*/
        {
            id: "vVZNZ5",
            message:
              " Property {0}, function {1}, array {2}, constant {3}, object {4} anything {5}",
            values: {
            0: props.name,
            1: random(),
            2: array[index],
            3: 42,
            4: new Date(),
            5: props.messages[index].value(),
          },
        }
      );
    `,
  },
  {
    name: "Newlines are preserved",
    input: `
        import { t } from '@lingui/core/macro';
        t\`Multiline
          string\`
      `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        _i18n._(
          /*i18n*/
          {
            id: "+8iwDA",
            message: "Multiline\\n          string",
          }
        );
      `,
  },
  {
    name: "Support template strings in t macro message",
    input: `
        import { t } from '@lingui/core/macro'
        const msg = t({ message: \`Hello \${name}\` })
      `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        const msg = _i18n._(
          /*i18n*/
          {
            values: {
              name: name,
            },
            message: "Hello {name}",
            id: "OVaF9k",
          }
        );
      `,
  },
  {
    name: "Support template strings in t macro message, with custom i18n instance",
    input: `
        import { t } from '@lingui/core/macro'
        import { i18n } from './lingui'
        const msg = t(i18n)({ message: \`Hello \${name}\` })
      `,
    expected: `
        import { i18n } from "./lingui";
        const msg = i18n._(
          /*i18n*/
          {
            values: {
              name: name,
            },
            message: "Hello {name}",
            id: "OVaF9k",
          }
        );
      `,
  },
  {
    name: "Support template strings in t macro message, with custom i18n instance object property",
    input: `
        import { t } from '@lingui/core/macro'
        const msg = t(global.i18n)({ message: \`Hello \${name}\` })
      `,
    expected: `const msg = global.i18n._(
        /*i18n*/
        {
          values: {
            name: name,
          },
          message: "Hello {name}",
          id: "OVaF9k",
        }
      );
    `,
  },
  {
    name: "Should generate different id when context provided",
    input: `
        import { t } from '@lingui/core/macro'
        t({ message: "Hello" })
        t({ message: "Hello", context: "my custom" })
      `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        _i18n._(
          /*i18n*/
          {
            message: "Hello",
            id: "uzTaYi",
          }
        );
        _i18n._(
          /*i18n*/
          {
            context: "my custom",
            message: "Hello",
            id: "BYqAaU",
          }
        );
      `,
  },
  {
    name: "Context might be passed as template literal",
    input: `
        import { t } from '@lingui/core/macro'
        t({ message: "Hello", context: "my custom" })
        t({ message: "Hello", context: \`my custom\` })
      `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        _i18n._(
          /*i18n*/
          {
            context: "my custom",
            message: "Hello",
            id: "BYqAaU",
          }
        );
        _i18n._(
          /*i18n*/
          {
            context: \`my custom\`,
            message: "Hello",
            id: "BYqAaU",
          }
        );
      `,
  },
  {
    name: "Support id and comment in t macro as callExpression",
    input: `
        import { t, plural } from '@lingui/core/macro'
        const msg = t({ id: 'msgId', comment: 'description for translators', message: plural(val, { one: '...', other: '...' }) })
      `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        const msg = _i18n._(
          /*i18n*/
          {
            id: "msgId",
            values: {
              val: val,
            },
            message: "{val, plural, one {...} other {...}}",
            comment: "description for translators",
          }
        );
      `,
  },
  {
    name: "Support id with message interpolation",
    input: `
        import { t } from '@lingui/core/macro'
        const msg = t({ id: 'msgId', message: \`Some \${value}\` })
      `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        const msg = _i18n._(
          /*i18n*/
          {
            id: "msgId",
            values: {
              value: value,
            },
            message: "Some {value}",
          }
        );
      `,
  },
  {
    name: "Support id in template literal",
    input: `
        import { t } from '@lingui/core/macro'
        const msg = t({ id: \`msgId\` })
      `,
    expected: `
    import { i18n as _i18n } from "@lingui/core";
    const msg =
      _i18n._(/*i18n*/
        {
          id: \`msgId\`
        });
      `,
  },
  {
    name: "Production - only essential props are kept",
    production: true,
    input: `
      import { t } from '@lingui/core/macro';
      const msg = t\`Message\`
    `,
    expected: `
      import { i18n as _i18n } from "@lingui/core";
      const msg = _i18n._(/*i18n*/
      {
        id: "xDAtGP",
      });
    `,
  },
  {
    name: "Production - only essential props are kept, with plural, with custom i18n instance",
    production: true,
    input: `
      import { t, plural } from '@lingui/core/macro';
      const msg = t({
        id: 'msgId',
        comment: 'description for translators',
        context: 'some context',
        message: plural(val, { one: '...', other: '...' })
      })
    `,
    expected: `
      import { i18n as _i18n } from "@lingui/core";
      const msg =
      _i18n._(/*i18n*/
      {
        id: "msgId",
        values: {
          val: val,
        },
      });
    `,
  },
  {
    name: "Production - only essential props are kept, with custom i18n instance",
    production: true,
    input: `
        import { t } from '@lingui/core/macro';
        import { i18n } from './lingui';
        const msg = t(i18n)({
            message: \`Hello $\{name\}\`,
            id: 'msgId',
            comment: 'description for translators',
            context: 'My Context',
        })
    `,
    expected: `
        import { i18n } from "./lingui";
        const msg =
        i18n._(/*i18n*/
          {
            id: 'msgId',
            values: {
              name: name,
            },
         });
    `,
  },
  {
    name: "Production - only essential props are kept",
    production: true,
    input: `
        import { t } from '@lingui/core/macro';
        const msg = t({
            message: \`Hello $\{name\}\`,
            id: 'msgId',
            comment: 'description for translators',
            context: 'My Context',
        })
    `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        const msg =
        _i18n._(/*i18n*/
          {
            id: 'msgId',
            values: {
              name: name,
            },
         });
    `,
  },
  {
    name: "Production - all props kept if extract: true",
    production: true,
    macroOpts: {
      extract: true,
    },
    input: `
        import { t } from '@lingui/core/macro';
        const msg = t({
            message: \`Hello $\{name\}\`,
            id: 'msgId',
            comment: 'description for translators',
            context: 'My Context',
        })
    `,
    expected: `
        import { i18n as _i18n } from "@lingui/core";
        const msg =
        _i18n._(/*i18n*/
          {
            id: 'msgId',
            context: 'My Context',
            values: {
              name: name,
            },
            message: "Hello {name}",
            comment: "description for translators",
         });
    `,
  },
  {
    name: "Newlines after continuation character are removed",
    filename: "js-t-continuation-character.js",
  },
  {
    filename: "js-t-var/js-t-var.js",
  },
  {
    name: "Support t in t",
    input: `
        import { t } from '@lingui/core/macro'
        t\`Field \${t\`First Name\`} is required\`
      `,
    expected: `
      import { i18n as _i18n } from "@lingui/core";
_i18n._(
  /*i18n*/
  {
    id: "O8dJMg",
    message: "Field {0} is required",
    values: {
      0: _i18n._(
        /*i18n*/
        {
          id: "kODvZJ",
          message: "First Name",
        }
      ),
    },
  }
);

      `,
  },
  {
    name: "should correctly process nested macro when referenced from different imports",
    input: `
        import { t } from '@lingui/core/macro'
        import { plural } from '@lingui/core/macro'
        t\`Ola! \${plural(count, {one: "1 user", many: "# users"})} is required\`
      `,
    expected: `
import { i18n as _i18n } from "@lingui/core";
_i18n._(
  /*i18n*/
  {
    id: "EUO+Gb",
    message: "Ola! {count, plural, one {1 user} many {# users}} is required",
    values: {
      count: count,
    },
  }
);
      `,
  },
  {
    name: "should correctly process nested macro when referenced from different imports 2",
    input: `
        import { t as t1, plural as plural1 } from '@lingui/core/macro'
        import { plural as plural2, t as t2 } from '@lingui/core/macro'
        t1\`Ola!  \${plural2(count, {one: "1 user", many: "# users"})} Ola!\`
        t2\`Ola! \${plural1(count, {one: "1 user", many: "# users"})} Ola!\`
      `,
    expected: `
    import { i18n as _i18n } from "@lingui/core";
_i18n._(
  /*i18n*/
  {
    id: "aui5Gr",
    message: "Ola!  {count, plural, one {1 user} many {# users}} Ola!",
    values: {
      count: count,
    },
  }
);
_i18n._(
  /*i18n*/
  {
    id: "wJ7AD9",
    message: "Ola! {count, plural, one {1 user} many {# users}} Ola!",
    values: {
      count: count,
    },
  }
);
`,
  },
]

export default cases
