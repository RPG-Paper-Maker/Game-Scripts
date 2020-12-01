#!/bin/sh
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/export \* from "(.+)"/export \* from "\1\.js"/g'
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/export \* as (.+) from "(.+)"/export \* as \1 from "\.\/\1\/index\.js"/g'
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/import (\{ .+ \}|\* as .+) from "(\.\.?\/)^(Manager|Core|Scene|Common|Graphic|Datas)"/import \1 from "\2\3\.js"/g'
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/import (\{ .+ \}|\* as .+) from "(\.\.?\/)(Manager|Core|Scene|Common|Graphic|Datas)"/import \1 from "\2\3\/index\.js"/g'
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/import (\{ .+ \}|\* as .+) from "(\.\.?)"/import \1 from "\2\/index\.js"/g'