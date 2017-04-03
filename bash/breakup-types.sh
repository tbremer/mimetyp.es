#!/usr/bin/env bash
FILE='./types-with-extensions.txt';
OBJ_BY_TYPE='';
OBJ_BY_EXT='';
TAB=$'\t'
REGEX="^([^#].+)${TAB}{1,}(.+)$"

while read -r LINE; do
  if [[ "$LINE" =~ $REGEX ]]; then
    # MAKE OBJ_BY_TYPE
    TYPE="${BASH_REMATCH[1]//[[:blank:]]/}"
    _EXT=${BASH_REMATCH[2]// /'", "'}
    EXTENSIONS="[\"$_EXT\"]"
    OBJ_BY_TYPE+="\"$TYPE\":$EXTENSIONS,"

    # MAKE OBJ_BY_EXT
    EXT_ARR=(${BASH_REMATCH[2]// / })

    for i in ${EXT_ARR[@]}; do
      OBJ_BY_EXT+="\"$i\":\"$TYPE\","
    done

  fi
done < <(curl -s 'http://svn.apache.org/viewvc/httpd/httpd/branches/2.2.x/docs/conf/mime.types?view=co')

echo "{${OBJ_BY_TYPE%?}}" > assets/data/mime-by-types.json
echo "{${OBJ_BY_EXT%?}}" > assets/data/mime-by-ext.json
