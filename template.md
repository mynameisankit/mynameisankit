# Hello (नमस्ते) #

{{#with personal_details}}
My Name Is {{name}} and I am from {{from.city}}, {{from.state}}, {{from.country}} currently living in {{current.city}}, {{current.state}}, {{current.country}}
{{/with}}

{{#with skills}}
### My Skills ###
<p>
  {{#each proficient}}
    <img alt="{{this.name}}" src="https://img.shields.io/badge/-{{this.name}}-{{#if (isColorGiven this.color)}}{{this.color}}{{else}}000000{{/if}}?style=for-the-badge&logo={{this.logo}}&logoColor=white" />
  {{/each}}
</p>

<h5><strong><i>Elementary Proficiency</i></strong></h5>
<p>
  {{#each elementary}}
    <img alt="{{this.name}}" src="https://img.shields.io/badge/-{{this.name}}-{{#if (isColorGiven this.color)}}{{this.color}}{{else}}000000{{/if}}?style=for-the-badge&logo={{this.logo}}&logoColor=white" />
  {{/each}}
</p>

<h3>Tools</h3>
<p>
  {{#each misc}}
    <img alt="{{this.name}}" src="https://img.shields.io/badge/-{{this.name}}-{{#if (isColorGiven this.color)}}{{this.color}}{{else}}000000{{/if}}?style=for-the-badge&logo={{this.logo}}&logoColor=white" />
  {{/each}}
</p>
{{/with}}

{{#with personal_details}}
### Where to find me ###
<p>
  {{#each social_links}}
    <a href="{{this.url}}">
      <img alt="{{this.name}} Link" src="https://img.shields.io/badge/-{{this.name}}-{{#if (isColorGiven this.color)}}{{this.color}}{{else}}000000{{/if}}?style=for-the-badge&logo={{this.name}}&logoColor=white" />
    </a>
  {{/each}}
</p>
{{/with}}

{{#with repo_details}}
<h3 align="center"></h3>
<p align="center">
  This <i>README</i> file is generated <b>every 3 hours</b>
  </br>
  Last refresh: {{refresh_date}}
  <br />
</p>

------------

<p align="center">
  <img alt="Stars" src="https://shields.io/badge/Stars-{{stars}}-0A66C2?style=for-the-badge"/> 
  <img alt="Forks" src="https://shields.io/badge/Forks-{{forks}}-0A66C2?style=for-the-badge"/>
</p>
{{/with}}