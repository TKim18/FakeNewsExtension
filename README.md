# Pak

## Description:
Chrome extension that replaces articles found in fake (more like biased) news sites with similar news from CNN 

## Overview: 
1. Interface with the Mercury Web Parser (MWP) API to obtain headline, author, body text, relevant images.
2. Obtain the article body and send to Google Cloud Platform Natural Language API to obtain named entities.
3. Selected top entities and used as search term to look for similar news from Associated Press from GDELT API.
4. Take url of the returned article from GDELT API and submit to MWP API.
5. Replace old article and inject the CNN article content returned by MWP API. TADAAAA!


## Features to develop / WISH LIST!
- Classifier to identify fake/biased news on run-time using machine learning
- Calculate text similarity of fake/biased news 
- Fact checker: highlights paragraphs that were found to be erroneous
- Warning signal on google search for fake news site
