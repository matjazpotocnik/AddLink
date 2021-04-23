1. Create (or use existing) files field (Type 'Files'). Allow multiple files, 1 line description.
   Let's call this file field "myfiles".
2. Create (or use existing) url field (Type 'URL') or text field (Type 'Text').
   Let's call this field "mylink".
3. Create a template with the name "field-myfiles". Note: the template name MUST start with "field-"
   followed by the file field name from the first step. Add a field "mylink" to this template.
4. Add file field "myfiles" to your template. Pages that use your template now have files field with the
   description field and "mylink" field. See [blog post](https://processwire.com/blog/posts/pw-3.0.142/).
5. In this module settings page, select "myfiles" from the list of fields in the "File fields to allow links upload.".
   If you add "mylink" field to the "Fields to hide with regular files" then "myfield" is visible only with URL 
   "uploaded" files and it's not present when you upload regular file. Note: hidden fields should not be set as
   required! Save settings.
6. Edit a page that is using your template. Notice "Insert URL" link next to the "Upload file" button. When you
   click "Insert URL", a "fake" file named "_xxxxxxx.link" is uploaded (xxxxxx are random numbers) and "mylink"
   input field is displayed where you can enter your URL. 
   See video https://processwire.com/talk/topic/22829-link-upload/?do=findComment&comment=195776
7. In the template file on the frontend, you would iterate over "myfiles" field and render files as
   usual, checking if the current file has "mylink" field (and the file has a "link" extension):

~~~html
   foreach($page->myfiles as $d) {
	  $url = ($d->mylink && $d->mylink !== "") ? $d->mylink : $d->url;
	  $desc = ($d->description !== "") ? $d->description : $url;
	  echo "<a href='$url'>$desc</a>\n";
   }
~~~

[Video presentation](https://s3.us-west-2.amazonaws.com/processwire-forums/monthly_2020_01/urlupload.thumb.gif.90f1fd84e88ac2b241968ec9acd8811c.gif)
