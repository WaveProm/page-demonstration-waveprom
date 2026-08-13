---
name: idiomatic-naming
description: Audit every hand-written name in a codebase - constants, functions, parameters, local variables, files and folders - against idiomatic conventions, and return a three-column table of what to rename. Covers every file in the project folder, source and scripts and configuration alike, finished or not. Use this whenever the user asks to review naming, to make names idiomatic, to clean up a codebase, or says a name is unclear, vague or misleading. Also use it before writing a README or documentation, because a name that needs a comment will need a paragraph.
---

# Idiomatic naming

Names are the only documentation that cannot go out of date silently, because the compiler
carries them. Comments drift, names are enforced.

The audit covers everything named by hand : constants, functions, parameters, local variables,
object keys, file names, folder names. It never covers names imposed from outside, such as
third-party API fields, environment variable names, or wire formats already agreed with another
program.

Every file in the project folder is in scope. Source, scripts, pages, configuration, documents.

Finished or not. The state of a file is not a criterion, and "it is not a reference yet" is the
exemption that gets invented every time.

A name in a draft is read exactly like any other name, and the file that was going to be
rewritten rarely is.

## Step zero, before any other criterion

Anything not in English becomes English. Identifiers, comments, commit messages, file and folder
names. A codebase in two languages forces every reader to hold two vocabularies at once, and the
mixture always spreads.

Content addressed to an end user is not code and stays in its own language.

## Criteria

Name what the thing actually holds, not the case you had in mind. A name narrower than its
content sends the reader looking for a second variable that does not exist, and a name wider
than its content hides what is missing. `READ_DOCS` governed every tool, not the reading of
documents. `DENIED_SERVERS` held tool names, not servers. `IP` accepted a hostname, so it was
`HOST`. This criterion finds more lies than the rest of the list put together.

A name that needs a comment is the wrong name. Delete the comment and fix the name, in that
order.

A function starts with an action verb. An adjective or a past participle is not a name, and
neither is a noun : `required` and `permissionGate` name a state and a thing, `requireEnv` and
`guardToolCall` name an act. The same rule opens `procedure-poc-build`, where the name is
treated as the contract of the function.

A function returning a boolean reads as a question : `is`, `has`, `can`, `should`.

A boolean value reads as a statement about the world. `EXECUTION_ENABLED` can be true or false ;
`EXECUTE` cannot, because a bare verb gives no way to tell an order from a state.

A function returning a collection says so in the plural.

Name the role, never the person or the deployment. `userMessages` survives a change of user,
`messagesFromGray` does not, and a first name in a variable welds the code to one installation.

A module-level constant says what it is, not only what it contains. `ROOT` of what.
`PUBLIC` what kind of thing. Add the type when the value alone leaves it ambiguous : a regular
expression, a directory, a path, a table of files.

When a value and its path both exist, the path carries the suffix : `FIRST_PROMPT` and
`FIRST_PROMPT_PATH`. The pair then reads without thinking.

A local variable takes the name of the thing it holds, not of the act that produced it.
`asked` is an act, `presented` is the thing. `name` is a category, `hostname` is the thing.

The same word never names two types in two files that talk to each other. Both readings are
correct in their own file, which is what makes it expensive.

A name describing an earlier version of the program is a lie. When a behaviour is removed,
every name that mentioned it is now wrong, and it will be read as documentation of what the
code does today.

Prefer the word the domain already uses. Invent nothing, and do not translate a domain term
into a generic one. When a framework already names the thing in its own signature, that is the
word : `navigationAction` and `contentView` beat any synonym you would pick.

Conventions are the target language's, never this skill's examples. Swift writes constants in
lowerCamelCase where JavaScript writes SCREAMING_SNAKE, and copying an example across is how an
audit produces confidently wrong output. The kind of artifact matters too : one type per file
governs a library, not a single-file executable, where the file names the program and the type
names its role.

Renaming a file or a folder is never a local change. Find what names it elsewhere first : build
scripts, Dockerfile, import paths, configuration, launch entries. Report those call sites with
the proposal, or say plainly that you did not look.

## Output format

One table, three columns, grouped by file. Plain text only : no emojis, no arrows, no symbols,
no severity markers.

| Objet | Idiomatique | Proposition |

Column two holds `oui` or `non`, nothing else. Column three is empty when column two says
`oui`, unless a reservation is worth recording. When it says `non`, give the proposed name and
the reason on the same line, in one sentence.

List names judged correct as well. A table that only shows problems cannot be checked for
omissions, and the reader cannot tell what was examined from what was skipped.

## After the table

Report separately, in prose, anything that is not a rename : two names for one concept, one
name for two types, a language mixture, a convention broken in one place only. These are the
findings that change a design rather than a label.

Then ask before applying. Renaming is mechanical and reversible, but the choice of a word
belongs to whoever will read it for the next year.

## The table is not evidence

Verify every `oui` before trusting it. Two of the three known failures were a name marked
correct that was not : a function named with a noun, and a boolean named with a bare verb.
A wrong `non` costs a discussion. A wrong `oui` closes the question forever.

The third failure came from the reviewer, not the audit : a file and its main type were called
inconsistent, on a convention that did not apply to that kind of artifact. Whoever checks the
table is running the same criteria and can be wrong in the same way.

Sometimes the answer is not a rename at all. A value nobody reads has no good name, because it
should not exist : the wire once carried an end-of-turn payload that no consumer ever opened,
and the fix was to delete it, not to translate it.
