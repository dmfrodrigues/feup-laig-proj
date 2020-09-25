user="$HOME"
repo_name=`basename "$(dirname \"$0\")"`
deploy_dir="$user/public_html/feup/3/1/$repo_name"
this_repo="`dirname \"$0\"`"

cd $this_repo

git pull
chmod 755 pull.sh

rm -rf $deploy_dir
mkdir -p $deploy_dir
cp -r lib TP1 TP2 TP3 pull.php $deploy_dir

echo "<!DOCTYPE html><html><body>Last updated "`date`"</body></html>" > $deploy_dir/index.html
