---
name: code-review
description: "Request a comprehensive code review. Use when: you want detailed feedback on code quality, security, performance, React patterns, testing, and accessibility. Provide the file path or code snippet."
example: "/code-review src/components/Dashboard/Dashboard.jsx"
---

# Code Review Prompt

Request an expert code review for JavaScript/JSX/React code.

## How to Use

Type the command with one of these formats:

```
/code-review src/path/to/file.jsx
/code-review src/components/Card/Card.jsx
/code-review [paste code here]
```

## What You'll Get

- **Critical Issues**: Security, performance, and error-handling problems
- **Quality Analysis**: SOLID principles, React patterns, best practices
- **Testing Feedback**: Coverage gaps and edge cases
- **Accessibility Review**: a11y concerns and improvements
- **Specific Suggestions**: Code examples and refactoring recommendations
- **Overall Assessment**: Strengths and key improvement areas

## Review Dimensions

The review covers:

1. ✅ **Code Quality** - Readability, maintainability, and design patterns
2. 🔒 **Security** - Vulnerabilities, data exposure, safe coding practices
3. ⚡ **Performance** - Optimization opportunities, re-renders, memory leaks
4. ⚛️ **React Patterns** - Hooks usage, component design, state management
5. 🧪 **Testing** - Coverage, edge cases, test quality
6. ♿ **Accessibility** - WCAG compliance, semantic HTML, keyboard navigation
7. 📚 **SOLID Principles** - Design principles and architectural concerns

## Required Output Format

Always include all sections below in this exact order:

1. Summary
2. Code Quality
3. Security
4. Performance
5. React Patterns
6. Testing
7. Accessibility
8. SOLID Principles
9. Final Verdict

If there are no issues in a section, explicitly write: "No major issues found."

## Example Review Request

```
/code-review src/components/Dashboard/Dashboard.jsx

I just refactored this component and want to ensure it follows best practices.
```

## Tips

- **For full files**: Just provide the file path
- **For snippets**: Paste the code directly
- **For context**: Describe what the code does or what you're concerned about
- **For focused review**: Mention specific aspects (e.g., "focus on React hooks usage")


## Related Features

- Use `/code-review` for comprehensive analysis
- Ask follow-up questions in chat for clarification or alternatives
- Request specific refactoring suggestions if needed
- Combine with `/security-review` for a deep dive into vulnerabilities
- Combine with `/performance-review` for optimization insights
- Combine with `/accessibility-review` for a detailed a11y audit
- Combine with `/testing-review` for focused feedback on test quality and coverage
