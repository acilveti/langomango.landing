# Visitor Context Usage Guide

This guide explains how to use the Visitor Context that has been implemented for sharing visitor-related state (including selected language) across your application.

## Overview

The Visitor Context provides a centralized way to manage visitor-related state across all components in your application. Currently, it manages the selected language state, but can be extended to include other visitor preferences. This eliminates the need to pass props through multiple component layers.

## Setup

The Visitor Context is already set up in your application:

1. **Context Definition**: Located at `contexts/VisitorContext.tsx`
2. **Provider**: Wrapped around the entire app in `pages/_app.tsx`

## How to Use

### 1. Import the Hook

In any component where you need to access or update the selected language:

```typescript
import { useVisitor } from 'contexts/VisitorContext';
```

### 2. Use the Hook

```typescript
function MyComponent() {
  const { selectedLanguage, setSelectedLanguage, availableLanguages } = useVisitor();
  
  // selectedLanguage: Language | null - Currently selected language
  // setSelectedLanguage: (language: Language | null) => void - Function to update the language
  // availableLanguages: Language[] - List of all available languages
}
```

### 3. Language Type

The `Language` type has the following structure:

```typescript
interface Language {
  code: string;  // Language code (e.g., 'es', 'fr', 'de')
  name: string;  // Language name (e.g., 'Spanish', 'French', 'German')
  flag: string;  // Emoji flag (e.g., '🇪🇸', '🇫🇷', '🇩🇪')
}
```

## Example Usage

### Reading the Selected Language

```typescript
import React from 'react';
import { useVisitor } from 'contexts/VisitorContext';

function LanguageDisplay() {
  const { selectedLanguage } = useVisitor();
  
  if (!selectedLanguage) {
    return <div>No language selected</div>;
  }
  
  return (
    <div>
      Current language: {selectedLanguage.flag} {selectedLanguage.name}
    </div>
  );
}
```

### Updating the Selected Language

```typescript
import React from 'react';
import { useVisitor } from 'contexts/VisitorContext';

function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage, availableLanguages } = useVisitor();
  
  return (
    <select 
      value={selectedLanguage?.code || ''} 
      onChange={(e) => {
        const language = availableLanguages.find(lang => lang.code === e.target.value);
        if (language) {
          setSelectedLanguage(language);
        }
      }}
    >
      <option value="">Select a language</option>
      {availableLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## Components Already Using the Context

The following components have been updated to use the Visitor Context:

1. **LanguageSelector** (`components/LanguageSelector.tsx`)
   - Automatically syncs with the global language state
   - Updates the context when a language is selected

2. **ReaderDemoWidget** (`components/ReaderDemoWidget.tsx`)
   - Reads the selected language from context
   - Updates the context when language is changed within the widget

3. **Homepage** (`pages/index.tsx`)
   - Uses the context to manage language state for the entire page

## Helper Functions

The context also exports some helper functions:

```typescript
// Get a language by its code
import { getLanguageByCode } from 'contexts/VisitorContext';

const spanish = getLanguageByCode('es');
// Returns: { code: 'es', name: 'Spanish', flag: '🇪🇸' }

// Get the default language (German)
import { getDefaultLanguage } from 'contexts/VisitorContext';

const defaultLang = getDefaultLanguage();
// Returns: { code: 'de', name: 'German', flag: '🇩🇪' }
```

## Benefits

1. **No Prop Drilling**: No need to pass language props through multiple component layers
2. **Single Source of Truth**: All components share the same language state
3. **Easy to Use**: Simple hook-based API
4. **Type Safe**: Full TypeScript support with proper types
5. **Consistent State**: Language selection persists across different parts of the app

## Notes

- The context does not persist the visitor preferences between page refreshes. If you need persistence, you can add localStorage support to the VisitorProvider.
- The default language is German (`de`) if no language is selected.
- All 36 languages are available by default, but you can customize this by passing a different `availableLanguages` prop to the VisitorProvider in `_app.tsx`.
- The context can be extended to include other visitor-related state such as preferences, settings, or user information.
