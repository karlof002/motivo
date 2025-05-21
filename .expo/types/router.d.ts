/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/JournalScreen`; params?: Router.UnknownInputParams; } | { pathname: `/GoalsScreen`; params?: Router.UnknownInputParams; } | { pathname: `/MoodTrackerScreen`; params?: Router.UnknownInputParams; } | { pathname: `/SettingsScreen`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/JournalScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/GoalsScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/MoodTrackerScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/SettingsScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/JournalScreen${`?${string}` | `#${string}` | ''}` | `/GoalsScreen${`?${string}` | `#${string}` | ''}` | `/MoodTrackerScreen${`?${string}` | `#${string}` | ''}` | `/SettingsScreen${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/JournalScreen`; params?: Router.UnknownInputParams; } | { pathname: `/GoalsScreen`; params?: Router.UnknownInputParams; } | { pathname: `/MoodTrackerScreen`; params?: Router.UnknownInputParams; } | { pathname: `/SettingsScreen`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
